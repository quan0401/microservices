import { Client } from '@elastic/elasticsearch';
import { ClusterHealthResponse, GetResponse } from '@elastic/elasticsearch/lib/api/types';
import { winstonLogger, ISellerGig } from '@quan0401/ecommerce-shared';
import { Logger } from 'winston';
import { config } from '~/config';

const log: Logger = winstonLogger(config.ELASTIC_SEARCH_URL!, 'AuthServiceElasticsearchConnection', 'debug');

export const client: Client = new Client({
  node: config.ELASTIC_SEARCH_URL
});

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function checkConnection(): Promise<void> {
  let isConnected = false;
  while (!isConnected) {
    try {
      const health: ClusterHealthResponse = await client.cluster.health();
      log.info(`AuthService Elastichsearch health status - ${health.status}`);
      isConnected = true;
    } catch (error) {
      log.error('Connection to Elastichsearch failed. Retrying in 10 seconds...');
      log.log('error', 'AuthService checkConnection() error', 'debug');
      await delay(10000);
    }
  }
}

export async function checkIfIndexExists(indexName: string): Promise<boolean> {
  const exists: boolean = await client.indices.exists({
    index: indexName
  });
  return exists;
}

export async function createIndex(indexName: string): Promise<void> {
  try {
    const exists: boolean = await checkIfIndexExists(indexName);
    if (exists) {
      log.warn(`Index "${indexName}" already exists.`);
    } else {
      await client.indices.create({ index: indexName });
      await client.indices.refresh({ index: indexName });
      log.info(`Created index ${indexName}`);
    }
  } catch (error) {
    log.error('Error creaet Elastic search index.');
    log.log('error', 'AuthService createIndex()', 'debug');
  }
}

export async function getDocumentById(indexName: string, gigId: string): Promise<ISellerGig> {
  try {
    const document: GetResponse = await client.get({
      index: indexName,
      id: gigId
    });
    return document._source as ISellerGig;
  } catch (error) {
    log.error('Get document elastich error', error);
    log.log('error', 'Auth service get elastic document error', error);
    return {} as ISellerGig;
  }
}
