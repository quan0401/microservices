import { Client } from '@elastic/elasticsearch';
import { ClusterHealthResponse, CountResponse, GetResponse } from '@elastic/elasticsearch/lib/api/types';
import { ISellerGig, winstonLogger } from '@quan0401/ecommerce-shared';
import { Logger } from 'winston';
import { config } from '~/config';

const log: Logger = winstonLogger(config.ELASTIC_SEARCH_URL!, 'GigServiceElasticsearchConnection', 'debug');

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
      log.info(`GigService Elastichsearch health status - ${health.status}`);
      isConnected = true;
    } catch (error) {
      log.error('Connection to Elastichsearch failed. Retrying in 10 seconds...');
      log.log('error', 'GigService checkConnection() error', 'debug');
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
    log.log('error', 'GigService createIndex()', 'debug');
  }
}

export const getDocumentCount = async (index: string): Promise<number> => {
  try {
    const result: CountResponse = await client.count({ index });
    return result.count;
  } catch (error) {
    log.log('error', 'GigService elastichsearch getDocumentCount() method error:', error);
    return 0;
  }
};

export const addDataToIndex = async (index: string, itemId: string, gigDocument: unknown): Promise<void> => {
  try {
    await client.index({
      index,
      id: itemId,
      document: gigDocument
    });
  } catch (error) {
    log.error('addDataToIndex elastic error', error);
    log.log('error', 'GigService addDataToIndex error');
  }
};

export const getIndexedData = async (index: string, itemId: string): Promise<ISellerGig> => {
  try {
    const result: GetResponse = await client.get({ index, id: itemId });
    return result._source as ISellerGig;
  } catch (error) {
    log.log('error', 'GigService elasticsearch getIndexedData() method error:', error);
    return {} as ISellerGig;
  }
};

export const updateIndexedData = async (index: string, itemId: string, gigDocument: unknown): Promise<void> => {
  try {
    await client.update({
      index,
      id: itemId,
      doc: gigDocument
    });
  } catch (error) {
    log.error('updateIndexedData elastic error', error);
    log.log('error', 'GigService updateIndexedData error');
  }
};

export const deleteIndexedData = async (index: string, itemId: string): Promise<void> => {
  try {
    await client.delete({
      index,
      id: itemId
    });
  } catch (error) {
    log.error('deleteIndexedData elastic error', error);
    log.log('error', 'GigService deleteIndexedData error');
  }
};
