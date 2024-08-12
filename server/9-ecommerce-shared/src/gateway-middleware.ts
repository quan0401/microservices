import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { NotAuthorizedError } from './error-handler';

const tokens: string[] = [
  'auth',
  'seller',
  'gig',
  'search',
  'buyer',
  'message',
  'order',
  'review',
];

export function verifyGatewayRequest(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!req.headers?.gatewaytoken)
    throw new NotAuthorizedError(
      'Invalid Request',
      'verifyGatewayRequest(): request not coming from api gateway'
    );
  const token: string = req.headers.gatewaytoken as string;
  try {
    // TODO: pass secret later
    const payload: { id: string; iat: number } = jwt.verify(
      token,
      '1282722b942e08c8a6cb033aa6ce850e'
    ) as { id: string; iat: number };
    if (!tokens.includes(payload.id))
      throw new NotAuthorizedError(
        'Invalid Request',
        'verifyGatewayRequest(): request not coming from api gateway'
      );
  } catch (error) {
    throw new NotAuthorizedError(
      'Invalid Request',
      'verifyGatewayRequest(): request not coming from api gateway'
    );
  }
  next();
}
