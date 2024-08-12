import { message } from '~/controllers/create';
import { conversation, conversationList, messages, userMessages } from '~/controllers/get';
import { markMultipleMessages, markSingleMessage, offer } from '~/controllers/update';
import express, { Router } from 'express';

const router: Router = express.Router();

const messageRoutes = (): Router => {
  router.get('/conversation/:senderEmail/:receiverEmail', conversation);
  router.get('/conversations/:email', conversationList);
  router.get('/:senderEmail/:receiverEmail', messages);
  router.get('/:conversationId', userMessages);
  router.post('/', message);
  router.put('/offer', offer);
  router.put('/mark-as-read', markSingleMessage);
  router.put('/mark-multiple-as-read', markMultipleMessages);

  return router;
};

export { messageRoutes };
