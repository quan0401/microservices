import { IReviewDocument, IReviewMessageDetails } from '@quan0401/ecommerce-shared';
import { QueryResult } from 'pg';
import { pool } from '~/database';
import { publishFanoutMessage } from '~/queues/review.producer';
import { reviewChannel } from '~/server';

interface IReviewerObjectKeys {
  [key: string]: string | number | Date | undefined;
}

const objKeys: IReviewerObjectKeys = {
  review: 'review',
  rating: 'rating',
  country: 'country',
  gigid: 'gigId',
  reviewerid: 'reviewerId',
  createdat: 'createdAt',
  orderid: 'orderId',
  sellerid: 'sellerId',
  reviewerimage: 'reviewerImage',
  reviewerusername: 'reviewerUsername',
  revieweremail: 'reviewerEmail',
  reviewtype: 'reviewType'
};

export const addReview = async (data: IReviewDocument): Promise<IReviewDocument> => {
  const { gigId, reviewerId, reviewerImage, sellerId, review, rating, orderId, reviewType, reviewerUsername, reviewerEmail, country } =
    data;
  const createdAtDate = new Date();
  const { rows } = await pool.query(
    `INSERT INTO reviews("gigId", "reviewerId", "reviewerImage", "sellerId", "review", "rating", "orderId", "reviewType", "reviewerUsername", "reviewerEmail", "country", "createdAt")
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `,
    [
      gigId,
      reviewerId,
      reviewerImage,
      sellerId,
      review,
      rating,
      orderId,
      reviewType,
      reviewerUsername,
      reviewerEmail,
      country,
      createdAtDate
    ]
  );
  const messageDetails: IReviewMessageDetails = {
    gigId: data.gigId,
    reviewerId: data.reviewerId,
    sellerId: data.sellerId,
    review: data.review,
    rating: data.rating,
    orderId: data.orderId,
    createdAt: `${createdAtDate}`,
    type: `${reviewType}`
  };
  await publishFanoutMessage(
    reviewChannel,
    'ecommerce-review',
    JSON.stringify(messageDetails),
    'Review details sent to order and users services'
  );
  // const result: IReviewDocument = Object.fromEntries(Object.entries(rows[0]).map(([key, value]) => [objKeys[key] || key, value]));
  return rows[0];
};

export const getReviewsByGigId = async (gigId: string): Promise<IReviewDocument[]> => {
  const reviews: QueryResult = await pool.query('SELECT * FROM reviews WHERE "gigId" = $1', [gigId]);
  return reviews.rows;
};

export const getReviewsBySellerId = async (sellerId: string): Promise<IReviewDocument[]> => {
  const reviews: QueryResult = await pool.query('SELECT * FROM reviews WHERE "sellerId" = $1 AND "reviewType" = $2', [
    sellerId,
    'buyer-review'
  ]);
  return reviews.rows;
};
