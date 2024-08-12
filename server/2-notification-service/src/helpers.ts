import { IEmailLocals, winstonLogger } from '@quan0401/ecommerce-shared';
import { config } from '~/config';
import nodemailer, { Transporter } from 'nodemailer';
import Email from 'email-templates';
import { Logger } from 'winston';
import path from 'path';

const log: Logger = winstonLogger(config.ELASTIC_SEARCH_URL!, 'mailTransportHelper', 'debug');

export async function emailTemplates(template: string, receiverEmail: string, locals: IEmailLocals): Promise<void> {
  try {
    const smtpTransport: Transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: config.SENDER_EMAIL,
        pass: config.SENDER_EMAIL_PASSWORD
      }
    });

    const email: Email = new Email({
      message: {
        from: `Ecommerce App<${config.SENDER_EMAIL}>`
      },
      send: true,
      preview: false,
      transport: smtpTransport,
      views: {
        options: {
          extension: 'ejs'
        }
      },
      juice: true,
      juiceResources: {
        preserveImportant: true,
        webResources: {
          relativeTo: path.join(__dirname, '../build')
        }
      }
    });
    await email.send({
      template: path.join(__dirname, '..', 'src/emails', template),
      message: {
        to: receiverEmail
      },
      locals
    });
  } catch (error) {
    // we don't need to use log.log since it's cautgh in sendEmail method
    log.error(error);
  }
}
