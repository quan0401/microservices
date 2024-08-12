import { IConversationDocument } from '@quan0401/ecommerce-shared';
import { Model, Schema, model } from 'mongoose';
import { MessageModel } from './message.schema';

const conversationSchema: Schema = new Schema({
  conversationId: { type: String, required: true, unique: true, index: true },
  senderUsername: { type: String, required: true, index: true },
  receiverUsername: { type: String, required: true, index: true },
  senderEmail: { type: String, required: true, index: true },
  receiverEmail: { type: String, required: true, index: true }
});
// MongooseDefaultQueryMiddleware

conversationSchema.pre('findOneAndDelete', async function (next: () => void) {
  const docToDelete = await this.model.findOne(this.getFilter());
  if (docToDelete) {
    await MessageModel.deleteMany({
      conversationId: docToDelete.conversationId
    });
  }
  next();
});

const ConversationModel: Model<IConversationDocument> = model<IConversationDocument>('Conversation', conversationSchema, 'Conversation');
export { ConversationModel };
