import { StatusCodes } from 'http-status-codes';
import { ISearchResult, ISellerGig } from '@quan0401/ecommerce-shared';
import { Request, Response } from 'express';
import { getGigById, getSellerGigs, getSellerPausedGigs } from '~/services/gig.service';
import { getUserSelectedGigCategory } from '~/redis/gig.cache';
import { getAllRecordsOfIndex, getMoreGigsLikeThis, getTopRatedGigsByCategory, gigsSearchByCategory } from '~/services/search.service';
import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { GigModel } from '~/models/gig.schema';

export const byGigId = async (req: Request, res: Response): Promise<void> => {
  const gig: ISellerGig = await getGigById(req.params.gigId);
  res.status(StatusCodes.OK).json({
    message: 'Get gig by id',
    gig
  });
};

export const sellerGigs = async (req: Request, res: Response): Promise<void> => {
  const gigs: ISellerGig[] = await getSellerGigs(req.params.sellerId);
  res.status(StatusCodes.OK).json({
    message: 'Get seller gigs',
    gigs
  });
};

export const sellerInactiveGigs = async (req: Request, res: Response): Promise<void> => {
  const gigs: ISellerGig[] = await getSellerPausedGigs(req.params.sellerId);
  res.status(StatusCodes.OK).json({
    message: 'Get seller inactive gigs',
    gigs
  });
};

export const topRatedGigsByCategory = async (req: Request, res: Response): Promise<void> => {
  const category: string = await getUserSelectedGigCategory(`selectedCategories:${req.params.email}`);
  const resultHits: ISellerGig[] = [];
  const gigs: ISearchResult = await getTopRatedGigsByCategory(category);
  for (const item of gigs.hits) {
    resultHits.push(item._source as ISellerGig);
  }
  res.status(StatusCodes.OK).json({
    message: 'Search top gigs results',
    total: gigs.total,
    gigs: resultHits
  });
};

export const gigsByCategory = async (req: Request, res: Response): Promise<void> => {
  const category: string = await getUserSelectedGigCategory(`selectedCategories:${req.params.email}`);
  const resultHits: ISellerGig[] = [];
  const gigs: ISearchResult = await gigsSearchByCategory(category);
  for (const item of gigs.hits) {
    resultHits.push(item._source as ISellerGig);
  }
  res.status(StatusCodes.OK).json({
    message: 'Search gigs by category results',
    total: gigs.total,
    gigs: resultHits
  });
};

export const moreGigsLikeThis = async (req: Request, res: Response): Promise<void> => {
  const resultHits: ISellerGig[] = [];
  const gigs: ISearchResult = await getMoreGigsLikeThis(req.params.gigId);

  for (const item of gigs.hits) {
    resultHits.push(item._source as ISellerGig);
  }
  res.status(StatusCodes.OK).json({
    message: 'More gigs like this result',
    total: gigs.total,
    gigs: resultHits
  });
};

const JSONToFile = (obj: any, filename: string) => {
  const filePath = resolve(__dirname, `${filename}.json`);
  try {
    writeFileSync(filePath, JSON.stringify(obj, null, 2));
    console.log(`File successfully written to ${filePath}`);
  } catch (error) {
    console.error(`Error writing file to ${filePath}`, error);
  }
};

export const getAllFromIndex = async (req: Request, res: Response): Promise<void> => {
  const resultHits: ISellerGig[] = [];
  const gigs: ISearchResult = await getAllRecordsOfIndex(req.params.index);

  for (const item of gigs.hits) {
    resultHits.push(item._source as ISellerGig);
  }

  const test = [...resultHits];
  for (const hit of test) {
    hit._id = hit.id;
    delete hit.id;
    await GigModel.create(hit);
  }
  const testGig = await GigModel.findById('6547ee735c323d4335dfcc39');

  res.status(StatusCodes.OK).json({
    message: `All records of ${req.params.index}`,
    total: gigs.total,
    gigs:
      // resultHits
      testGig
  });
};
