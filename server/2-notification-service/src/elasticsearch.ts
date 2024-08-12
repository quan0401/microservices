import { winstonLogger } from '@quan0401/ecommerce-shared';
import { Logger } from 'winston';
import { config } from '~/config';
import { Client } from '@elastic/elasticsearch';
import { ClusterHealthResponse } from '@elastic/elasticsearch/lib/api/types';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationElasticSearchServer', 'debug');

export const elasticSearchClient: Client = new Client({
  node: `${config.ELASTIC_SEARCH_URL}`
});

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function checkConnection() {
  let isConnected = false;
  while (!isConnected) {
    try {
      const health: ClusterHealthResponse = await elasticSearchClient.cluster.health();
      log.info(`notificationservice ElasticSearch health status - ${health.status}`);
      isConnected = true;
    } catch (error) {
      log.error('Connection to Elasticsearch failed. Retrying in 10 seconds...');
      log.log('error', 'notificationservice checkConnection() method', error);
      await delay(10000);
    }
  }
}
