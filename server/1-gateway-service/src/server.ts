import { StatusCodes } from 'http-status-codes';
import { Application, NextFunction, Request, Response, json, urlencoded } from 'express';
import { IErrorResponse, winstonLogger, CustomeError } from '@quan0401/ecommerce-shared';
import { Logger } from 'winston';
import cookieSession from 'cookie-session';
import hpp from 'hpp';
import helmet from 'helmet';
import cors from 'cors';
import { isAxiosError } from 'axios';
import http from 'http';
import compression from 'compression';
import { config } from '~/config';
import { elasticSearch } from '~/elasticsearch';
import { appRoutes } from '~/routes';
import { axiosAuthInstance } from '~/services/api/auth.service';
import 'express-async-errors';
import { axiosBuyerInstance } from '~/services/api/buyer.service';
import { axiosSellerInstance } from '~/services/api/seller.service';
import { Server } from 'socket.io';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import { SocketIOAppHandler } from './sockets/socket';
import { axiosGigInstance } from './services/api/gig.service';
import { axiosMessageInstance } from './services/api/message.service';
import { axiosOrderInstance } from './services/api/order.service';

const SERVER_PORT = 4000;
const DEFAULT_ERROR_CODE = 500;
const log: Logger = winstonLogger(config.ELASTIC_SEARCH_URL!, 'apiGatewayServer', 'debug');
export let socketIO: Server;

export class GatewayServer {
  private app: Application;
  constructor(app: Application) {
    this.app = app;
  }
  public start() {
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.routesMiddleware(this.app);
    this.startElasticSearch();
    this.errorHandler(this.app);
    this.startServer(this.app);
  }

  private securityMiddleware(app: Application): void {
    app.set('trust proxy', 1); // trust first proxy
    app.use(
      cookieSession({
        name: 'session',
        keys: [config.SECRET_KEY_ONE!, config.SECRET_KEY_TWO!],
        secure: config.NODE_ENV !== 'development',
        maxAge: 3600 * 1000
        // maxAge: 5000
        // sameSite: 'none',
      })
    );
    app.use(hpp());
    app.use(helmet());
    app.use(
      cors({
        origin: config.CLIENT_URL!, // client url
        credentials: true, // so that we can attach token
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
      })
    );

    app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.session?.jwt) {
        axiosAuthInstance.defaults.headers['Authorization'] = `Bearer ${req.session.jwt}`;
        axiosBuyerInstance.defaults.headers['Authorization'] = `Bearer ${req.session.jwt}`;
        axiosSellerInstance.defaults.headers['Authorization'] = `Bearer ${req.session.jwt}`;
        axiosGigInstance.defaults.headers['Authorization'] = `Bearer ${req.session.jwt}`;
        axiosMessageInstance.defaults.headers['Authorization'] = `Bearer ${req.session.jwt}`;
        axiosOrderInstance.defaults.headers['Authorization'] = `Bearer ${req.session.jwt}`;
      }
      next();
    });
  }

  private standardMiddleware(app: Application): void {
    app.use(compression());
    app.use(json({ limit: '200mb' }));
    app.use(urlencoded({ extended: true, limit: '200mb' }));
  }

  private routesMiddleware(app: Application): void {
    appRoutes(app);
  }

  private startElasticSearch(): void {
    elasticSearch.checkConnection();
  }

  private errorHandler(app: Application): void {
    app.use('*', (req: Request, res: Response, next: NextFunction) => {
      const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
      log.log('error', `${fullUrl} endpoint does not exists.`, '');
      res.status(StatusCodes.NOT_FOUND).json({ message: 'The endpoint called does not exist' });
      next();
    });

    app.use((error: IErrorResponse, _req: Request, res: Response, next: NextFunction) => {
      if (error instanceof CustomeError) {
        log.log('error', `GatewayService ${error.comingFrom}:`, error);
        res.status(error.statusCode).json(error.serializeError());
      } else if (isAxiosError(error)) {
        if (error?.response?.data?.comingFrom === undefined) {
          log.log('error', `GatewayService Axios Error`, error);
        } else {
          log.log('error', `GatewayService Axios Error - ${error?.response?.data?.comingFrom}: ${error?.response?.data?.message}`);
        }
        res
          .status(error?.response?.data?.statusCode ?? DEFAULT_ERROR_CODE)
          .json({ message: error?.response?.data?.message ?? 'Error occurred.' });
      } else {
        log.log('error', `Gateway uncaught error`, error);
      }
      next();
    });
  }

  private async startServer(app: Application): Promise<void> {
    try {
      const httpServer: http.Server = new http.Server(app);
      const socketIO: Server = await this.createSocketIO(httpServer);
      this.startHttpServer(httpServer);
      this.socketIOConnections(socketIO);
    } catch (error) {
      log.log('error', 'GatewayService startService() method error', error);
    }
  }

  private async createSocketIO(httpServer: http.Server): Promise<Server> {
    const io: Server = new Server(httpServer, {
      cors: {
        origin: `${config.CLIENT_URL}`,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
      }
    });
    const pubClient = createClient({ url: config.REDIS_HOST });
    const subClient = pubClient.duplicate();
    await Promise.all([pubClient.connect(), subClient.connect()]);
    io.adapter(createAdapter(pubClient, subClient));
    socketIO = io;
    return io;
  }

  private startHttpServer(httpServer: http.Server) {
    try {
      log.info(`Gateway server has started with process id ${process.pid}`);
      httpServer.listen(SERVER_PORT, () => {
        log.info(`GatewayServer running on port ${SERVER_PORT}`);
      });
    } catch (error) {
      log.log('error', 'GatewayService startHttpServer() method error', error);
    }
  }

  private socketIOConnections(io: Server): void {
    const socketIOApp = new SocketIOAppHandler(io);
    socketIOApp.listen();
  }
}
