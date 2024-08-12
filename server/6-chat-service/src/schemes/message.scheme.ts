import Joi, { ObjectSchema } from 'joi';

const messageSchema: ObjectSchema = Joi.object().keys({
  _id: Joi.string().optional().allow(null, ''),
  body: Joi.string().optional().allow(null, ''),
  file: Joi.string().optional().allow(null, ''),
  fileType: Joi.string().optional().allow(null, ''),
  fileName: Joi.string().optional().allow(null, ''),
  fileSize: Joi.string().optional().allow(null, ''),
  gigId: Joi.string().optional().allow(null, ''),
  conversationId: Joi.string().optional().allow(null, ''),
  hasConversationId: Joi.boolean().required().messages({
    'boolean.base': 'hasConversationId id is required',
    'boolean.empty': 'hasConversationId id is required',
    'any.required': 'hasConversationId id is required'
  }), // this is only for checking if conversation id exist
  sellerId: Joi.string().required().messages({
    'string.base': 'Seller id is required',
    'string.empty': 'Seller id is required',
    'any.required': 'Seller id is required'
  }),
  buyerId: Joi.string().required().messages({
    'string.base': 'Buyer id is required',
    'string.empty': 'Buyer id is required',
    'any.required': 'Buyer id is required'
  }),
  senderUsername: Joi.string().required().messages({
    'string.base': 'Sender username is required',
    'string.empty': 'Sender username is required',
    'any.required': 'Sender username is required'
  }),
  senderEmail: Joi.string().email().required().messages({
    'string.base': 'Sender email is required',
    'string.empty': 'Sender email is required',
    'any.required': 'Sender email is required'
  }),
  senderPicture: Joi.string().required().messages({
    'string.base': 'Sender picture is required',
    'string.empty': 'Sender picture is required',
    'any.required': 'Sender picture is required'
  }),
  receiverUsername: Joi.string().required().messages({
    'string.base': 'Receiver username is required',
    'string.empty': 'Receiver username is required',
    'any.required': 'Receiver username is required'
  }),
  receiverEmail: Joi.string().email().required().messages({
    'string.base': 'Receiver email is required',
    'string.empty': 'Receiver email is required',
    'any.required': 'Receiver email is required'
  }),
  receiverPicture: Joi.string().required().messages({
    'string.base': 'Receiver picture is required',
    'string.empty': 'Receiver picture is required',
    'any.required': 'Receiver picture is required'
  }),
  isRead: Joi.boolean().optional().allow(null, ''),
  hasOffer: Joi.boolean().optional().allow(null, ''),
  offer: Joi.object({
    gigTitle: Joi.string().optional().allow(null, ''),
    price: Joi.number().optional().allow(null, ''),
    description: Joi.string().optional().allow(null, ''),
    deliveryInDays: Joi.number().optional().allow(null, ''),
    oldDeliveryDate: Joi.string().optional().allow(null, ''),
    newDeliveryDate: Joi.string().optional().allow(null, ''),
    accepted: Joi.boolean().optional().allow(null, ''),
    cancelled: Joi.boolean().optional().allow(null, '')
  }).optional()
  // createdAt: Joi.string().optional().allow(null, '')
});

export { messageSchema };
