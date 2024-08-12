import dotenv from 'dotenv';
dotenv.config();
import cloudinary from 'cloudinary';

if (process.env.ENABLE_APM === '1') {
  require('elastic-apm-node').start({
    // Override service name from package.json
    // Allowed characters: a-z, A-Z, 0-9, -, _, and space
    serviceName: 'ecommerce-order',

    // Use if APM Server requires a token
    secretToken: process.env.ELASTIC_APM_SECRET_TOKEN,

    // Set custom APM Server URL (default: http://127.0.0.1:8200)
    serverUrl: process.env.ELASTIC_APM_SERVER_URL,
    environment: process.env.NODE_ENV,
    active: true,
    captureBody: 'all',
    errorOnAbortedRequests: true,
    captureErrorLogStackTracesedit: 'always'
  });
}

class Config {
  public ENABLE_APM: string | undefined;
  public DATABASE_URL: string | undefined;
  public GATEWAY_JWT_TOKEN: string | undefined;
  public JWT_TOKEN: string | undefined;
  public NODE_ENV: string | undefined;
  public API_GATEWAY_URL: string | undefined;
  public RABBITMQ_ENDPOINT: string | undefined;
  public CLOUD_NAME: string | undefined;
  public CLOUD_API_KEY: string | undefined;
  public CLOUD_API_SECRET: string | undefined;
  public CLOUD_FOLDER: string | undefined;
  public REDIS_HOST: string | undefined;
  public ELASTIC_SEARCH_URL: string | undefined;
  public ELASTIC_APM_SERVER_URL: string | undefined;
  public ELASTIC_APM_SECRET_TOKEN: string | undefined;
  public CLIENT_URL: string | undefined;
  public STRIPE_API_KEY: string | undefined;

  constructor() {
    this.ENABLE_APM = process.env.ENABLE_APM || '';
    this.DATABASE_URL = process.env.DATABASE_URL || '';
    this.GATEWAY_JWT_TOKEN = process.env.GATEWAY_JWT_TOKEN || '';
    this.JWT_TOKEN = process.env.JWT_TOKEN || '';
    this.NODE_ENV = process.env.NODE_ENV || '';
    this.API_GATEWAY_URL = process.env.API_GATEWAY_URL || '';
    this.RABBITMQ_ENDPOINT = process.env.RABBITMQ_ENDPOINT || '';
    this.CLOUD_NAME = process.env.CLOUD_NAME || '';
    this.CLOUD_API_KEY = process.env.CLOUD_API_KEY || '';
    this.CLOUD_API_SECRET = process.env.CLOUD_API_SECRET || '';
    this.CLOUD_FOLDER = process.env.CLOUD_FOLDER || '';
    this.REDIS_HOST = process.env.REDIS_HOST || '';
    this.ELASTIC_SEARCH_URL = process.env.ELASTIC_SEARCH_URL || '';
    this.ELASTIC_APM_SERVER_URL = process.env.ELASTIC_APM_SERVER_URL || '';
    this.CLIENT_URL = process.env.CLIENT_URL || '';
    this.ELASTIC_APM_SECRET_TOKEN = process.env.ELASTIC_APM_SECRET_TOKEN || '';
    this.STRIPE_API_KEY = process.env.STRIPE_API_KEY || '';
  }

  public cloudinaryConfig() {
    cloudinary.v2.config({
      cloud_name: this.CLOUD_NAME,
      api_key: this.CLOUD_API_KEY,
      api_secret: this.CLOUD_API_SECRET
    });
  }
}

export const config: Config = new Config();
