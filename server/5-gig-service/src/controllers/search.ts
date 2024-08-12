import { StatusCodes } from 'http-status-codes';
import { IPaginateProps, ISearchResult, ISellerGig } from '@quan0401/ecommerce-shared';
import { Request, Response } from 'express';
import { gigsSearch } from '~/services/search.service';
import { sortBy } from 'lodash';

export const gigs = async (req: Request, res: Response): Promise<void> => {
  const { from, size, type } = req.params;
  let resultHits: ISellerGig[] = [];
  let sort: number[] = [];
  const paginate: IPaginateProps = { from, size: parseInt(`${size}`), type };
  const gigs: ISearchResult = await gigsSearch(
    `${req.query.query}`,
    paginate,
    `${req.query.delivery_time}`,
    parseInt(`${req.query.minprice}`),
    parseInt(`${req.query.maxprice}`)
  );
  for (const item of gigs.hits) {
    if (type === 'backward' || type === 'forward') {
      resultHits.push(item._source as ISellerGig);
    } else {
      if (item.sort) {
        sort.push(item.sort[0]);
      }
    }
  }
  if (type === 'backward') {
    resultHits = sortBy(resultHits, ['sortId']);
  }
  res.status(StatusCodes.OK).json({
    message: 'Search gigs results',
    total: gigs.total,
    gigs: resultHits,
    sort
  });
};
