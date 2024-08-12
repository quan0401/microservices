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
import { createConnection } from '~/queues/connections';
import {
  consumeBuyerDirectMessage,
  consumeReviewFanoutMessages,
  consumeSeedGigDirectMessages,
  consumeSellerDirectMessage
} from '~/queues/user.consumer';

declare global {
  namespace Express {
    interface Request {
      currentUser?: IAuthPayload;
    }
  }
}

const SERVER_PORT = 4003;
const log: Logger = winstonLogger(config.ELASTIC_SEARCH_URL!, 'userServiceServer', 'debug');

export async function start(app: Application): Promise<void> {
  startServer(app);
  securyMiddleware(app);
  standardMiddleware(app);
  startElastichSearch();
  startQueues();
  routesMiddleware(app);
  authErrorHandler(app);
}

function securyMiddleware(app: Application): void {
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
}

function standardMiddleware(app: Application): void {
  app.use(compression());
  app.use(json({ limit: '200mb' }));
  app.use(urlencoded({ extended: true, limit: '200mb' }));
}
function routesMiddleware(app: Application): void {
  appRoutes(app);
}
async function startQueues(): Promise<void> {
  const userChannel: Channel = (await createConnection()) as Channel;
  await consumeBuyerDirectMessage(userChannel);
  await consumeSellerDirectMessage(userChannel);
  await consumeReviewFanoutMessages(userChannel);
  await consumeSeedGigDirectMessages(userChannel);
}
function startElastichSearch(): void {
  checkConnection();
}
function authErrorHandler(app: Application): void {
  app.use((error: IErrorResponse, req: Request, res: Response, next: NextFunction) => {
    log.log('error', `UserService ${error.comingFrom}:`, error);
    if (error instanceof CustomeError) {
      res.status(error.statusCode).json(error.serializeError());
    }
    next();
  });
}
function startServer(app: Application): void {
  try {
    const httpServer: http.Server = new http.Server(app);
    log.info(`UserService server has started with process id ${process.pid}`);
    httpServer.listen(SERVER_PORT, () => {
      log.info(`UserService server running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    log.log('error', 'userService startServer()', error);
  }
}
