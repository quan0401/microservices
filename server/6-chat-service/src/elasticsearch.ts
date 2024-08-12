import { Client } from '@elastic/elasticsearch';
import { ClusterHealthResponse } from '@elastic/elasticsearch/lib/api/types';
import { winstonLogger } from '@quan0401/ecommerce-shared';
import { Logger } from 'winston';
import { config } from '~/config';

const log: Logger = winstonLogger(config.ELASTIC_SEARCH_URL!, 'ChatServiceElasticsearchConnection', 'debug');

const client: Client = new Client({
  node: `${config.ELASTIC_SEARCH_URL}`
});

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function checkConnection(): Promise<void> {
  let isConnected = false;
  while (!isConnected) {
    try {
      const health: ClusterHealthResponse = await client.cluster.health();
      log.info(`ChatService Elastichsearch health status - ${health.status}`);
      isConnected = true;
    } catch (error) {
      log.error('Connection to Elastichsearch failed. Retrying in 10 seconds...');
      log.log('error', 'ChatService checkConnection() error', 'debug');
      await delay(10000);
    }
  }
}
