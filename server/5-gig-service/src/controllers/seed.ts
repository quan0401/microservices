import { publishDirectMessage } from '~/queues/gig.producer';
import { gigChannel } from '~/server';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const gig = async (req: Request, res: Response): Promise<void> => {
  const { count } = req.params;
  // Send message to user service, then user service gonna send sellers to gig
  await publishDirectMessage(
    gigChannel,
    'ecommerce-gig',
    'get-sellers',
    JSON.stringify({ type: 'getSellers', count }),
    'Gig seed message sent to user service.'
  );
  res.status(StatusCodes.CREATED).json({ message: 'Gig created successfully' });
};
