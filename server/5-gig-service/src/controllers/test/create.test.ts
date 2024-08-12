/* eslint-disable @typescript-eslint/no-explicit-any */
import { gigCreateScheme } from '~/schemes/gig.scheme';
import { BadRequestError } from '@quan0401/ecommerce-shared';
import { Request, Response } from 'express';
import { gigCreate } from '~/controllers/create';
import * as helper from '@quan0401/ecommerce-shared';
import * as gigService from '~/services/gig.service';
import { authUserPayload, gigMockRequest, gigMockResponse, sellerGig } from '~/controllers/test/mocks/gig.mock';

jest.mock('~/services/gig.service');
jest.mock('@quan0401/ecommerce-shared');
jest.mock('@quan0401/ecommerce-shared');
jest.mock('~/schemes/gig');
jest.mock('~/elasticsearch');
jest.mock('@elastic/elasticsearch');

describe('Gig Controller', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('gig method', () => {
    it('should throw an error for invalid schema data', () => {
      const req: Request = gigMockRequest({}, sellerGig, authUserPayload) as unknown as Request;
      const res: Response = gigMockResponse();
      jest.spyOn(gigCreateScheme, 'validate').mockImplementation((): any =>
        Promise.resolve({
          error: {
            name: 'ValidationError',
            isJoi: true,
            details: [{ message: 'This is an error message' }]
          }
        })
      );

      gigCreate(req, res).catch(() => {
        expect(BadRequestError).toHaveBeenCalledWith('This is an error message', 'Create gig() method');
      });
    });

    it('should throw file upload error', () => {
      const req: Request = gigMockRequest({}, sellerGig, authUserPayload) as unknown as Request;
      const res: Response = gigMockResponse();
      jest.spyOn(gigCreateScheme, 'validate').mockImplementation((): any => Promise.resolve({ error: {} }));
      jest.spyOn(helper, 'uploads').mockImplementation((): any => Promise.resolve({ public_id: '' }));

      gigCreate(req, res).catch(() => {
        expect(BadRequestError).toHaveBeenCalledWith('File upload error. Try again.', 'Create gig() method');
      });
    });

    it('should create a new gig and return the correct response', async () => {
      const req: Request = gigMockRequest({}, sellerGig, authUserPayload) as unknown as Request;
      const res: Response = gigMockResponse();
      jest.spyOn(gigCreateScheme, 'validate').mockImplementation((): any => Promise.resolve({ error: {} }));
      jest.spyOn(helper, 'uploads').mockImplementation((): any => Promise.resolve({ public_id: '123456' }));
      jest.spyOn(gigService, 'createGig').mockResolvedValue(sellerGig);

      await gigCreate(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Gig created successfully.',
        gig: sellerGig
      });
    });
  });
});
