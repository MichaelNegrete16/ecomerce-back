import { Test, TestingModule } from '@nestjs/testing';
import { MerchantsController } from './merchants.controller';
import { MerchantsCaseUse } from '../../aplication/merchants.casouse';
import { MerchanstsRepository } from '../repository/merchants.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MerchantPaymentModel } from '../models/merchants.models';
import { Repository } from 'typeorm';

describe('MerchantsController', () => {
  let controller: MerchantsController;
  let merchantsCaseUse: MerchantsCaseUse;

  const mockRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockMerchantsCaseUse = {
    getMerchants: jest.fn(),
    CreateTransaction: jest.fn(),
    getTransactionStatus: jest.fn(),
    getPendingTransactions: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MerchantsController],
      providers: [
        {
          provide: MerchanstsRepository,
          useValue: {},
        },
        {
          provide: getRepositoryToken(MerchantPaymentModel),
          useValue: mockRepository,
        },
        {
          provide: MerchantsCaseUse,
          useValue: mockMerchantsCaseUse,
        },
      ],
    }).compile();

    controller = module.get<MerchantsController>(MerchantsController);
    merchantsCaseUse = module.get<MerchantsCaseUse>(MerchantsCaseUse);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMerchants', () => {
    it('should return merchant data', async () => {
      const expectedResult = {
        presigned_acceptance: {
          acceptance_token: 'test_token',
          permalink: 'https://test.com',
          type: 'END_USER_AGREEMENT',
        },
        presigned_personal_data_auth: {
          acceptance_token: 'test_auth_token',
          permalink: 'https://test-auth.com',
          type: 'PERSONAL_DATA_AUTH_AGREEMENT',
        },
      };

      mockMerchantsCaseUse.getMerchants.mockResolvedValue(expectedResult);

      const result = await controller.getMerchants();

      expect(result).toEqual(expectedResult);
      expect(mockMerchantsCaseUse.getMerchants).toHaveBeenCalled();
    });
  });

  describe('createValidateCard', () => {
    it('should create transaction successfully', async () => {
      const transactionRequest = {
        number: '4242424242424242',
        exp_month: '06',
        exp_year: '29',
        cvc: '123',
        card_holder: 'Test User',
        customer_email: 'test@test.com',
        acceptance_token: 'test_token',
        accept_personal_auth: 'test_auth',
        amount_in_cents: 100000,
        currency: 'COP',
      };

      const expectedResult = {
        id: 1,
        reference: 'ECORM123456789',
        status: 'PENDING',
        status_message: null,
        payment_method: {},
        payment_source: {},
        amount_in_cents: 100000,
        currency: 'COP',
        customer_email: 'test@test.com',
        payment_link_id: null,
        bill_id: null,
        created_at: new Date(),
      };

      mockMerchantsCaseUse.CreateTransaction.mockResolvedValue(expectedResult);

      const result = await controller.createValidateCard(transactionRequest);

      expect(result).toEqual(expectedResult);
      expect(mockMerchantsCaseUse.CreateTransaction).toHaveBeenCalledWith(
        transactionRequest,
      );
    });
  });

  describe('getTransactionStatus', () => {
    it('should return transaction status', async () => {
      const transactionId = 'test_transaction_id';
      const expectedResult = {
        currentStatus: 'APPROVED',
        hasChanged: true,
        originalTransaction: {
          id: 1,
          reference: transactionId,
          status: 'PENDING',
        },
        updatedTransaction: {
          id: 1,
          reference: transactionId,
          status: 'APPROVED',
        },
      };

      mockMerchantsCaseUse.getTransactionStatus.mockResolvedValue(
        expectedResult,
      );

      const result = await controller.getTransactionStatus({ transactionId });

      expect(result).toEqual(expectedResult);
      expect(mockMerchantsCaseUse.getTransactionStatus).toHaveBeenCalledWith(
        transactionId,
      );
    });
  });

  describe('getPendingTransactions', () => {
    it('should return pending transactions', async () => {
      const expectedResult = [
        {
          id: 1,
          reference: 'ECORM123456789',
          status: 'PENDING',
          amount_in_cents: 100000,
          currency: 'COP',
          customer_email: 'test@test.com',
          created_at: new Date(),
        },
      ];

      mockMerchantsCaseUse.getPendingTransactions.mockResolvedValue(
        expectedResult,
      );

      const result = await controller.getPendingTransactions();

      expect(result).toEqual(expectedResult);
      expect(mockMerchantsCaseUse.getPendingTransactions).toHaveBeenCalled();
    });
  });
});
