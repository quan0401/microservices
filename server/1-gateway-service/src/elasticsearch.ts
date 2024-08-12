import { Client } from '@elastic/elasticsearch';
import { ClusterHealthResponse } from '@elastic/elasticsearch/lib/api/types';
import { winstonLogger } from '@quan0401/ecommerce-shared';
import { Logger } from 'winston';
import { config } from '~/config';

const log: Logger = winstonLogger(config.ELASTIC_SEARCH_URL!, 'apiGatewayElasticConnection', 'debug');

class ElasticSearch {
  private elasticSearchClient: Client;
  constructor() {
    this.elasticSearchClient = new Client({
      node: config.ELASTIC_SEARCH_URL
    });
  }

  private async delay(miliseconds: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, miliseconds));
  }

  public async checkConnection(): Promise<void> {
    let isConnected = false;
    while (!isConnected) {
      try {
        const health: ClusterHealthResponse = await this.elasticSearchClient.cluster.health();
        log.info(`gatewayservice ElasticSearch health status - ${health.status}`);
        isConnected = true;
      } catch (error) {
        log.error('Connection to ElasticSearch failed. Retrying in 10 seconds...');
        log.log('error', 'gatewayservice checkConnection() method', error);
        this.delay(10000);
      }
    }
  }
}
export const elasticSearch: ElasticSearch = new ElasticSearch();
