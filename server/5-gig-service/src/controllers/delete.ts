import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { deleteGig as deleteGigService } from '~/services/gig.service';

export const deleteGig = async (req: Request, res: Response): Promise<void> => {
  await deleteGigService(req.params.gigId, req.params.sellerId);
  res.status(StatusCodes.OK).json({ message: 'Gig deleted successfully' });
};
