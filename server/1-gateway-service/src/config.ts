import dotenv from 'dotenv';
dotenv.config();

if (process.env.ENABLE_APM === '1') {
  require('elastic-apm-node').start({
    // Override service name from package.json
    // Allowed characters: a-z, A-Z, 0-9, -, _, and space
    serviceName: 'ecommerce-gateway',

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
  // api gateway and microservice
  public GATEWAY_JWT_TOKEN: string | undefined;
  // client and api gateway
  public JWT_TOKEN: string | undefined;
  public NODE_ENV: string | undefined;
  public SECRET_KEY_ONE: string | undefined;
  public SECRET_KEY_TWO: string | undefined;
  public CLIENT_URL: string | undefined;
  public AUTH_BASE_URL: string | undefined;
  public USERS_BASE_URL: string | undefined;
  public GIG_BASE_URL: string | undefined;
  public MESSAGE_BASE_URL: string | undefined;
  public ORDER_BASE_URL: string | undefined;
  public REVIEW_BASE_URL: string | undefined;
  public REDIS_HOST: string | undefined;
  public ELASTIC_SEARCH_URL: string | undefined;
  public ELASTIC_APM_SERVER_URL: string | undefined;
  public ELASTIC_APM_SECRET_TOKEN: string | undefined;
  constructor() {
    this.ENABLE_APM = process.env.ENABLE_APM || '';
    this.GATEWAY_JWT_TOKEN = process.env.GATEWAY_JWT_TOKEN || '';
    this.JWT_TOKEN = process.env.JWT_TOKEN || '';
    this.NODE_ENV = process.env.NODE_ENV || '';
    this.SECRET_KEY_ONE = process.env.SECRET_KEY_ONE || '';
    this.SECRET_KEY_TWO = process.env.SECRET_KEY_TWO || '';
    this.CLIENT_URL = process.env.CLIENT_URL || '';
    this.AUTH_BASE_URL = process.env.AUTH_BASE_URL || '';
    this.USERS_BASE_URL = process.env.USERS_BASE_URL || '';
    this.GIG_BASE_URL = process.env.GIG_BASE_URL || '';
    this.MESSAGE_BASE_URL = process.env.MESSAGE_BASE_URL || '';
    this.ORDER_BASE_URL = process.env.ORDER_BASE_URL || '';
    this.REVIEW_BASE_URL = process.env.REVIEW_BASE_URL || '';
    this.REDIS_HOST = process.env.REDIS_HOST || '';
    this.ELASTIC_SEARCH_URL = process.env.ELASTIC_SEARCH_URL || '';
    this.ELASTIC_APM_SERVER_URL = process.env.ELASTIC_APM_SERVER_URL || '';
    this.ELASTIC_APM_SECRET_TOKEN = process.env.ELASTIC_APM_SECRET_TOKEN || '';
  }
}

export const config: Config = new Config();
