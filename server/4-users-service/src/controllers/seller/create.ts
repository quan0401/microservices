import { StatusCodes } from 'http-status-codes';
import { BadRequestError, IBuyerDocument, ISellerDocument } from '@quan0401/ecommerce-shared';
import { sellerScheme } from '~/schemes/seller.scheme';
import { getSellerByEmail } from '~/services/seller.service';
import { Request, Response } from 'express';
import { createSeller as createSellerService } from '~/services/seller.service';
import { getBuyerByEmail } from '~/services/buyer.service';

export const createSeller = async (req: Request, res: Response): Promise<void> => {
  const { error } = await Promise.resolve(sellerScheme.validate(req.body));
  if (error?.details) {
    throw new BadRequestError(error.details[0].message, 'Create seller() method error');
  }
  const checkIfSellerExist: ISellerDocument | null = await getSellerByEmail(req.currentUser!.email);
  if (checkIfSellerExist) {
    throw new BadRequestError('Seller already exist. Go to your account page to update.', 'Create seller() method error already exists');
  }
  const checkIfUserExist: IBuyerDocument | null = await getBuyerByEmail(req.currentUser!.email);
  if (!checkIfUserExist) {
    throw new BadRequestError(
      'Account doesnt exists yet. Have to create normal account then become a seller',
      'Create seller() method error already exists'
    );
  }

  const seller: ISellerDocument = {
    profilePublicId: req.body.profilePublicId,
    fullName: req.body.fullName,
    username: req.currentUser!.username,
    email: req.currentUser!.email,
    profilePicture: req.body.profilePicture,
    description: req.body.description,
    oneliner: req.body.oneliner,
    country: req.body.country,
    skills: req.body.skills,
    languages: req.body.languages,
    responseTime: req.body.responseTime,
    experience: req.body.experience,
    education: req.body.education,
    socialLinks: req.body.socialLinks,
    certificates: req.body.certificates
  };
  const createdSeller: ISellerDocument = await createSellerService(seller);
  res.status(StatusCodes.CREATED).json({ message: 'Seller created successfully', seller: createdSeller });
};
