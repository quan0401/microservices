import crypto from 'crypto';

import Stripe from 'stripe';
import { Request, Response } from 'express';
import { config } from '~/config';
import { StatusCodes } from 'http-status-codes';
import {
  approveDeliveryDate,
  approveOrder,
  cancelOrder,
  rejectDeliveryDate,
  requestDeliveryExtension,
  sellerDeliverOrder
} from '~/services/order.service';
import { orderUpdateScheme } from '~/schemes/order.scheme';
import { BadRequestError, IDeliveredWork, IOrderDocument, uploads } from '@quan0401/ecommerce-shared';
import { UploadApiResponse } from 'cloudinary';
import { isClassDeclaration } from 'typescript';

const stripe: Stripe = new Stripe(config.STRIPE_API_KEY!, {
  typescript: true
});

const cancel = async (req: Request, res: Response): Promise<void> => {
  await stripe.refunds.create({
    payment_intent: `${req.body.paymentIntent}`
  });
  const { orderId } = req.params;
  await cancelOrder(orderId, req.body.orderData);
  res.status(StatusCodes.OK).json({ message: 'Order cancelled successfully.' });
};

const requestExtension = async (req: Request, res: Response): Promise<void> => {
  const { error } = await Promise.resolve(orderUpdateScheme.validate(req.body));
  if (error?.details) {
    throw new BadRequestError(error.details[0].message, 'Update requestExtension() method');
  }
  const { orderId } = req.params;
  const order: IOrderDocument = await requestDeliveryExtension(orderId, req.body);
  res.status(StatusCodes.OK).json({ message: 'Order delivery request', order });
};

const deliveryDate = async (req: Request, res: Response): Promise<void> => {
  const { error } = await Promise.resolve(orderUpdateScheme.validate(req.body));
  if (error?.details) {
    throw new BadRequestError(error.details[0].message, 'Update deliveryDate() method');
  }
  const { orderId, type } = req.params;
  const order: IOrderDocument = type === 'approve' ? await approveDeliveryDate(orderId, req.body) : await rejectDeliveryDate(orderId);
  res.status(StatusCodes.OK).json({ message: 'Order delivery date extension', order });
};

const buyerApproveOrder = async (req: Request, res: Response): Promise<void> => {
  const { orderId } = req.params;
  const order: IOrderDocument = await approveOrder(orderId, req.body);
  res.status(StatusCodes.OK).json({ message: 'Order approved successfully.', order });
};

const deliverOrder = async (req: Request, res: Response): Promise<void> => {
  const { orderId } = req.params;
  let file: string = req.body.file;
  const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
  const randomCharacters: string = randomBytes.toString('hex');
  let result: UploadApiResponse;
  if (file) {
    result = (
      req.body.fileType === 'zip'
        ? await uploads(file, `${config.CLOUD_FOLDER}`, `${randomCharacters}.zip`)
        : await uploads(file, `${config.CLOUD_FOLDER}`)
    ) as UploadApiResponse;
    if (!result.public_id) {
      throw new BadRequestError('File upload error. Try again', 'Update deliverOrder() method');
    }
    file = result?.secure_url;
  }
  const deliveredWork: IDeliveredWork = {
    message: req.body.message,
    file,
    fileType: req.body.fileType,
    fileName: req.body.fileName,
    fileSize: req.body.fileSize
  };
  const order: IOrderDocument = await sellerDeliverOrder(orderId, true, deliveredWork);
  res.status(StatusCodes.OK).json({ message: 'Order delivered successfully.', order });
};

export { cancel, requestExtension, deliveryDate, buyerApproveOrder, deliverOrder };
