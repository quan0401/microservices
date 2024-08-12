import { gigUpdateScheme } from '~/schemes/gig.scheme';
import { updateActiveGigProp, updateGig } from '~/services/gig.service';
import { BadRequestError, ISellerGig, isDataURL, uploads } from '@quan0401/ecommerce-shared';
import { UploadApiResponse } from 'cloudinary';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { config } from '~/config';

export const gigUpdate = async (req: Request, res: Response): Promise<void> => {
  const { error } = await Promise.resolve(gigUpdateScheme.validate(req.body));
  if (error?.details) {
    throw new BadRequestError(error.details[0].message, 'Update gig() method');
  }
  const isDataUrl = isDataURL(req.body.coverImage);
  let coverImage = '';
  if (isDataUrl) {
    const result: UploadApiResponse = (await uploads(req.body.coverImage, config.CLOUD_FOLDER!)) as UploadApiResponse;
    if (!result.public_id) {
      throw new BadRequestError('File upload error. Try again.', 'Update gig() method');
    }
    coverImage = result?.secure_url;
  } else {
    coverImage = req.body.coverImage;
  }
  const gig: ISellerGig = {
    title: req.body.title,
    description: req.body.description,
    categories: req.body.categories,
    subCategories: req.body.subCategories,
    tags: req.body.tags,
    price: req.body.price,
    expectedDelivery: req.body.expectedDelivery,
    basicTitle: req.body.basicTitle,
    basicDescription: req.body.basicDescription,
    coverImage
  };
  const updatedGig: ISellerGig = await updateGig(req.params.gigId, gig);
  res.status(StatusCodes.OK).json({ message: 'Gig updated successfully.', gig: updatedGig });
};

export const gigUpdateActive = async (req: Request, res: Response): Promise<void> => {
  const updatedGig: ISellerGig = await updateActiveGigProp(req.params.gigId, req.body.active);
  res.status(StatusCodes.OK).json({ message: 'Gig updated successfully.', gig: updatedGig });
};
