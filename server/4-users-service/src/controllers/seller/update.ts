import { StatusCodes } from 'http-status-codes';
import { BadRequestError, ISellerDocument } from '@quan0401/ecommerce-shared';
import { Request, Response } from 'express';
import { updateSeller } from '~/services/seller.service';
import { sellerScheme } from '~/schemes/seller.scheme';

export const seller = async (req: Request, res: Response): Promise<void> => {
  const { error } = await Promise.resolve(sellerScheme.validate(req.body));
  if (error?.details) {
    throw new BadRequestError(error.details[0].message, 'Update seller method error');
  }
  const seller: ISellerDocument = {
    profilePublicId: req.body.profilePublicId,
    fullName: req.body.fullName,
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
  const updatedSeller: ISellerDocument | null = await updateSeller(req.params.sellerId, seller);
  res.status(StatusCodes.OK).json({ message: 'Seller updated successfully.', seller: updatedSeller });
};
