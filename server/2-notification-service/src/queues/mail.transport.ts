import { IEmailLocals, winstonLogger } from '@quan0401/ecommerce-shared';
import { Logger } from 'winston';
import { config } from '~/config';
import { emailTemplates } from '~/helpers';

const log: Logger = winstonLogger(config.ELASTIC_SEARCH_URL!, 'mailTransport', 'debug');

export async function sendEmail(template: string, receiverEmail: string, locals: IEmailLocals): Promise<void> {
  try {
    emailTemplates(template, receiverEmail, locals);
    log.info('Email sent successfully');
  } catch (error) {
    log.log('error', 'notificationservice MailTransport sendEmail() method error:', error);
  }
}
