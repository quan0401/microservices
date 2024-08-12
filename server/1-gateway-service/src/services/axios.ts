import { config } from '~/config';
import axios, { AxiosInstance } from 'axios';
import jwt from 'jsonwebtoken';

export class AxiosService {
  public axios: AxiosInstance;
  constructor(baseURL: string, serviceName: string) {
    this.axios = this.axiosCreateInstance(baseURL, serviceName);
  }
  private axiosCreateInstance(baseURL: string, serviceName?: string): AxiosInstance {
    let requestGatewayToken = '';
    if (serviceName) {
      requestGatewayToken = jwt.sign({ id: serviceName }, config.GATEWAY_JWT_TOKEN!);
    }
    const instance: AxiosInstance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        gatewaytoken: requestGatewayToken
      },
      // so that we can add token to our requeset
      withCredentials: true
    });
    return instance;
  }
}

// goal
// const axiosTest = new AxiosService(`${config.AUTH_BASE_URL}/api/v1/auth`, 'auth')
