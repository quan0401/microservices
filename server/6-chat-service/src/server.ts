import { CustomeError, IAuthPayload, IErrorResponse, winstonLogger } from '@quan0401/ecommerce-shared';
import { Application, json, NextFunction, Request, Response, urlencoded } from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import { verify } from 'jsonwebtoken';
import { Logger } from 'winston';
import { config } from '~/config';
import cors from 'cors';
import compression from 'compression';
import { checkConnection } from '~/elasticsearch';
import http from 'http';
import { appRoutes } from '~/routes';
import { Channel } from 'amqplib';
import 'express-async-errors';
import { createConnection } from '~/queues/connection';
import { Server } from 'socket.io';

declare global {
  namespace Express {
    interface Request {
      currentUser?: IAuthPayload;
    }
  }
}

const SERVER_PORT = 4005;
const log: Logger = winstonLogger(config.ELASTIC_SEARCH_URL!, 'chatServiceServer', 'debug');
export let chatChannel: Channel;
export let socketIOChatObject: Server;

export const start = async (app: Application): Promise<void> => {
  startServer(app);
  securyMiddleware(app);
  standardMiddleware(app);
  startElastichSearch();
  startQueues();
  routesMiddleware(app);
  authErrorHandler(app);
};

const securyMiddleware = (app: Application): void => {
  app.set('trust proxy', 1);
  app.use(hpp());
  app.use(helmet());
  app.use(
    cors({
      origin: config.API_GATEWAY_URL,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    })
  );

  app.use((req: Request, res: Response, next: NextFunction): void => {
    if (req.headers.authorization) {
      const token: string = req.headers.authorization.split(' ')[1];
      const payload: IAuthPayload = verify(token, config.JWT_TOKEN!) as IAuthPayload;
      req.currentUser = payload;
    }
    next();
  });
};

const standardMiddleware = (app: Application): void => {
  app.use(compression());
  app.use(json({ limit: '200mb' }));
  app.use(urlencoded({ extended: true, limit: '200mb' }));
};

const routesMiddleware = (app: Application): void => {
  appRoutes(app);
};

const startQueues = async (): Promise<void> => {
  chatChannel = (await createConnection()) as Channel;
};

const startElastichSearch = (): void => {
  checkConnection();
};

const authErrorHandler = (app: Application): void => {
  app.use((error: IErrorResponse, req: Request, res: Response, next: NextFunction) => {
    log.log('error', `ChatService ${error.comingFrom}:`, error);
    if (error instanceof CustomeError) {
      res.status(error.statusCode).json(error.serializeError());
    }
    next();
  });
};

const startServer = async (app: Application): Promise<void> => {
  try {
    const httpServer: http.Server = new http.Server(app);
    const socketIO: Server = await createSocketIO(httpServer);
    startHttpServer(httpServer);
    socketIOChatObject = socketIO;
  } catch (error) {
    log.log('error', 'chatService startServer()', error);
  }
};

const createSocketIO = async (httpServer: http.Server): Promise<Server> => {
  const io: Server = new Server(httpServer, {
    cors: {
      origin: `*`,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    }
  });
  return io;
};

const startHttpServer = (httpServer: http.Server): void => {
  try {
    log.info(`ChatService server has started with process id ${process.pid}`);
    httpServer.listen(SERVER_PORT, () => {
      log.info(`ChatService server running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    log.log('error', 'chatService startHttpServer()', error);
  }
};
