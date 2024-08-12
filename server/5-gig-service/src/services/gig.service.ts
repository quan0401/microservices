import { IRatingTypes, IReviewMessageDetails, ISellerDocument, ISellerGig } from '@quan0401/ecommerce-shared';
import { addDataToIndex, deleteIndexedData, getIndexedData, updateIndexedData } from '~/elasticsearch';
import { gigsSearchBySellerId } from '~/services/search.service';
import { GigModel } from '~/models/gig.schema';
import { publishDirectMessage } from '~/queues/gig.producer';
import { gigChannel } from '~/server';
import { faker } from '@faker-js/faker';
import { sample } from 'lodash';
import mongoose from 'mongoose';

export const getGigById = async (gigId: string): Promise<ISellerGig> => {
  const gig: ISellerGig = await getIndexedData('gigs', gigId);
  return gig;
};

export const getSellerGigs = async (sellerId: string): Promise<ISellerGig[]> => {
  const resultsHits: ISellerGig[] = [];
  const gigs = await gigsSearchBySellerId(sellerId, true);
  for (const item of gigs.hits) {
    resultsHits.push(item._source as ISellerGig);
  }
  return resultsHits;
};

export const getSellerPausedGigs = async (sellerId: string): Promise<ISellerGig[]> => {
  const resultsHits: ISellerGig[] = [];
  const gigs = await gigsSearchBySellerId(sellerId, false);
  for (const item of gigs.hits) {
    resultsHits.push(item._source as ISellerGig);
  }
  return resultsHits;
};

export const createGig = async (gig: ISellerGig): Promise<ISellerGig> => {
  const createdGig: ISellerGig = await GigModel.create(gig);
  if (createdGig) {
    // to remove _id field
    const data: ISellerGig = createdGig.toJSON?.() as ISellerGig;
    await publishDirectMessage(
      gigChannel,
      'ecommerce-seller-update',
      'user-seller',
      JSON.stringify({ type: 'update-gig-count', gigSellerId: `${data.sellerId}`, count: 1 }),
      'Details sent to users service'
    );
    await addDataToIndex('gigs', createdGig._id as string, data);
  }
  return createdGig;
};

export const deleteGig = async (gigId: string, sellerId: string): Promise<void> => {
  await GigModel.deleteOne({ _id: gigId }).exec();
  await publishDirectMessage(
    gigChannel,
    'ecommerce-seller-update',
    'user-seller',
    JSON.stringify({ type: 'update-gig-count', gigSellerId: sellerId, count: -1 }),
    'Details sent to user service.'
  );
  await deleteIndexedData('gigs', gigId);
};

export const updateGig = async (gigId: string, gigData: ISellerGig): Promise<ISellerGig> => {
  const updatedDoc: ISellerGig = (await GigModel.findOneAndUpdate(
    {
      _id: gigId
    },
    {
      $set: {
        title: gigData.title,
        description: gigData.description,
        categories: gigData.categories,
        subCategories: gigData.subCategories,
        tags: gigData.tags,
        price: gigData.price,
        coverImage: gigData.coverImage,
        expectedDelivery: gigData.expectedDelivery,
        basicTitle: gigData.basicTitle,
        basicDescription: gigData.basicDescription
      }
    },
    { new: true }
  ).exec()) as ISellerGig;
  if (updatedDoc) {
    const data: ISellerGig = updatedDoc.toJSON?.() as ISellerGig;
    await updateIndexedData('gigs', updatedDoc._id as string, data);
  }
  return updatedDoc;
};

export const updateActiveGigProp = async (gigId: string, gigActive: boolean): Promise<ISellerGig> => {
  const updatedDocument: ISellerGig = (await GigModel.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(gigId)
    },
    {
      active: gigActive
    },
    { new: true }
  ).exec()) as ISellerGig;
  if (updatedDocument) {
    const data: ISellerGig = updatedDocument.toJSON?.() as ISellerGig;
    await updateIndexedData('gigs', data.id as string, data);
  }
  return updatedDocument;
};

export const updateGigReview = async (data: IReviewMessageDetails): Promise<ISellerGig> => {
  const ratingTypes: IRatingTypes = {
    '1': 'one',
    '2': 'two',
    '3': 'three',
    '4': 'four',
    '5': 'five'
  };
  const ratingMapped = ratingTypes[`${data.rating}`];
  const updatedGig = await GigModel.findOneAndUpdate(
    { _id: data.gigId },
    {
      $inc: {
        ratingsCount: 1,
        ratingSum: data.rating,
        [`ratingCategories.${ratingMapped}.value`]: data.rating,
        [`ratingCategories.${ratingMapped}.count`]: 1
      }
    },
    {
      new: true,
      upsert: true
    }
  ).exec();
  if (updatedGig) {
    const data: ISellerGig = updatedGig.toJSON() as ISellerGig;
    await updateIndexedData('gigs', updatedGig._id as string, data);
  }
  return updatedGig;
};

export const seedData = async (sellers: ISellerDocument[], count: string): Promise<void> => {
  const categories: string[] = [
    'Graphics & Design',
    'Digital Marketing',
    'Writing & Translation',
    'Video & Animation',
    'Music & Audio',
    'Programming & Tech',
    'Data',
    'Business'
  ];
  const expectedDelivery: string[] = ['1 Day Delivery', '2 Days Delivery', '3 Days Delivery', '4 Days Delivery', '5 Days Delivery'];
  const randomRatings = [
    { sum: 20, count: 4 },
    { sum: 10, count: 2 },
    { sum: 20, count: 4 },
    { sum: 15, count: 3 },
    { sum: 5, count: 1 }
  ];

  for (let i = 0; i < sellers.length; i++) {
    const sellerDoc: ISellerDocument = sellers[i];
    const title = `I will ${faker.word.words(5)}`;
    const basicTitle = faker.commerce.productName();
    const basicDescription = faker.commerce.productDescription();
    const rating = sample(randomRatings);
    const gig: ISellerGig = {
      profilePicture: sellerDoc.profilePicture,
      sellerId: sellerDoc._id,
      email: sellerDoc.email,
      username: sellerDoc.username,
      title: title.length <= 80 ? title : title.slice(0, 80),
      basicTitle: basicTitle.length <= 40 ? basicTitle : basicTitle.slice(0, 40),
      basicDescription: basicDescription.length <= 100 ? basicDescription : basicDescription.slice(0, 100),
      categories: `${sample(categories)}`,
      subCategories: [faker.commerce.department(), faker.commerce.department(), faker.commerce.department()],
      description: faker.lorem.sentences({ min: 2, max: 4 }),
      tags: [faker.commerce.product(), faker.commerce.product(), faker.commerce.product(), faker.commerce.product()],
      price: parseInt(faker.commerce.price({ min: 20, max: 30, dec: 0 })),
      coverImage: faker.image.urlPicsumPhotos(),
      expectedDelivery: `${sample(expectedDelivery)}`,
      sortId: parseInt(count, 10) + i + 1,
      ratingsCount: (i + 1) % 4 === 0 ? rating!['count'] : 0,
      ratingSum: (i + 1) % 4 === 0 ? rating!['sum'] : 0
    };
    console.log(`***SEEDING GIG*** - ${i + 1} of ${count}`);
    await createGig(gig);
  }
};
