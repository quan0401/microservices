import { IBuyerDocument, firstLetterUppercase } from '@quan0401/ecommerce-shared';
import { BuyerModel } from '~/models/buyer.schema';

export const getBuyerByEmail = async (email: string): Promise<IBuyerDocument | null> => {
  const buyer: IBuyerDocument | null = await BuyerModel.findOne({ email }).exec();
  return buyer;
};

export const getBuyerByUsername = async (username: string): Promise<IBuyerDocument[]> => {
  const buyer: IBuyerDocument[] = await BuyerModel.find({ username: firstLetterUppercase(username) }).exec();
  return buyer;
};

export const getRandomBuyers = async (count: number): Promise<IBuyerDocument[]> => {
  const buyers: IBuyerDocument[] = await BuyerModel.aggregate([{ $sample: { size: count } }]);
  return buyers;
};

export const createBuyer = async (buyerData: IBuyerDocument): Promise<void> => {
  const checkIfBuyerExist: IBuyerDocument | null = await getBuyerByEmail(buyerData.email!);
  if (!checkIfBuyerExist) {
    await BuyerModel.create(buyerData);
  }
};

export const updateBuyerIsSellerProp = async (email: string): Promise<void> => {
  await BuyerModel.updateOne(
    { email },
    {
      $set: {
        isSeller: true
      }
    }
  ).exec();
};

export const updateBuyerPurchasesGigsProp = async (buyerId: string, purchasedGigId: string, type: string): Promise<void> => {
  await BuyerModel.updateOne(
    { _id: buyerId },
    type === 'purchased-gigs'
      ? {
          $push: {
            purchasedGigs: purchasedGigId // Push purchasedGigId to array
          }
        }
      : {
          $pull: {
            purchasedGigs: purchasedGigId // remove purchasedGigId from array
          }
        }
  ).exec();
};
