import { SearchResponse } from '@elastic/elasticsearch/lib/api/types';
import { IHitsTotal, IPaginateProps, IQueryList, ISearchResult } from '@quan0401/ecommerce-shared';
import { client } from '~/elasticsearch';

export const gigsSearchBySellerId = async (searchQuery: string, active: boolean): Promise<ISearchResult> => {
  const queryList: IQueryList[] = [
    {
      query_string: {
        fields: ['sellerId'],
        query: `*${searchQuery}*`
      }
    },
    {
      term: {
        active
      }
    }
  ];
  const result: SearchResponse = await client.search({
    index: 'gigs',
    query: {
      bool: {
        must: [...queryList]
      }
    }
  });
  const total: IHitsTotal = result.hits.total as IHitsTotal;
  return {
    total: total.value,
    hits: result.hits.hits
  };
};

export async function gigsSearch(
  searchQuery: string,
  paginate: IPaginateProps,
  deliveryTime?: string,
  min?: number,
  max?: number
): Promise<ISearchResult> {
  const { from, size, type } = paginate;
  const queryList: IQueryList[] = [
    {
      query_string: {
        fields: ['username', 'title', 'description', 'basicDescription', 'basicTitle', 'categories', 'subCategories', 'tags'],
        query: `*${searchQuery}*`
      }
    },
    {
      term: {
        active: true
      }
    }
  ];

  if (deliveryTime !== 'undefined') {
    queryList.push({
      query_string: {
        fields: ['expectedDelivery'],
        query: `*${deliveryTime}*`
      }
    });
  }

  if (!isNaN(parseInt(`${min}`)) && !isNaN(parseInt(`${max}`))) {
    queryList.push({
      range: {
        price: {
          gte: min,
          lte: max
        }
      }
    });
  }

  const result: SearchResponse = await client.search({
    index: 'gigs',
    size,
    query: {
      bool: {
        must: [...queryList]
      }
    },
    sort: [
      {
        // if forward: asc, else if backward: desc, else asc by default
        sortId: type === 'forward' ? 'asc' : type === 'backward' ? 'desc' : 'asc'
      }
    ],
    ...(from !== '0' && { search_after: [from] }),
    ...(type === 'jump' && { _source: false })
  });

  const total: IHitsTotal = result.hits.total as IHitsTotal;

  return {
    total: total.value,
    hits: result.hits.hits
  };
}

export const gigsSearchByCategory = async (searchQuery: string): Promise<ISearchResult> => {
  const result: SearchResponse = await client.search({
    index: 'gigs',
    size: 10,
    query: {
      bool: {
        must: [
          {
            query_string: {
              fields: ['categories'],
              query: `*${searchQuery}*`
            }
          },
          {
            term: {
              active: true
            }
          }
        ]
      }
    }
  });
  const total: IHitsTotal = result.hits.total as IHitsTotal;
  return {
    total: total.value,
    hits: result.hits.hits
  };
};

export const getMoreGigsLikeThis = async (gigId: string): Promise<ISearchResult> => {
  const result: SearchResponse = await client.search({
    index: 'gigs',
    size: 10,
    query: {
      more_like_this: {
        fields: ['username', 'title', 'description', 'basicDescription', 'basicTitle', 'categories', 'subCategories', 'tags'],
        like: [
          {
            _index: 'gigs',
            _id: gigId
          }
        ],
        min_doc_freq: 1,
        max_query_terms: 12
      }
    }
  });
  const total: IHitsTotal = result.hits.total as IHitsTotal;
  return {
    total: total.value,
    hits: result.hits.hits
  };
};

export const getTopRatedGigsByCategory = async (searchQuery: string): Promise<ISearchResult> => {
  const result: SearchResponse = await client.search({
    index: 'gigs',
    size: 10,
    query: {
      bool: {
        filter: {
          script: {
            script: {
              source: "doc['ratingSum'].value != 0 && (doc['ratingSum'].value / doc['ratingsCount'].value == params['threshold'])",
              lang: 'painless',
              params: {
                threshold: 5 // threshold param is passed into the script
              }
            }
          }
        },
        must: [
          {
            query_string: {
              fields: ['categories', 'subCategories'],
              query: `*${searchQuery}*`
            }
          }
        ]
      }
    }
  });
  const total: IHitsTotal = result.hits.total as IHitsTotal;
  return {
    total: total.value,
    hits: result.hits.hits
  };
};

export const getAllRecordsOfIndex = async (index: string): Promise<ISearchResult> => {
  const result: SearchResponse = await client.search({
    index,
    size: 100,
    query: {
      match_all: {}
    }
  });
  const total: IHitsTotal = result.hits.total as IHitsTotal;
  return {
    total: total.value,
    hits: result.hits.hits
  };
};
