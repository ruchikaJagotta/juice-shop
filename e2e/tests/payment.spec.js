import { test, expect } from '../fixtures/test.fixture';
import { VALID_NL_CARD, TEST_CARDS } from '../data/payment.data';
import { Validators } from '../utils/validators';

test.describe('Payment API Tests', () => {

  test('should add valid payment card', async ({ paymentService, authenticatedContext, globalCleanup }) => {
    const { context } = authenticatedContext;
    const response = await paymentService.addPaymentCard(VALID_NL_CARD);

    const body = await response.json();
    expect(response.status()).toBe(201);
    expect(body.status).toBe('success');
    expect(body.data.fullName).toBe(VALID_NL_CARD.fullName);
    globalCleanup.trackCard(body.data.id);

  });

  test('should validate credit card numbers', () => {
    Object.values(TEST_CARDS).forEach(cardNumber => {
      expect(Validators.isValidCreditCard(cardNumber)).toBe(true);
    });

    // Invalid cards
    expect(Validators.isValidCreditCard('1234567890123456')).toBe(false);
    expect(Validators.isValidCreditCard('0000000000000001')).toBe(false);
  });

  test('should get all payment cards', async ({ paymentService, authenticatedContext }) => {

    const { context } = authenticatedContext;
    const response = await paymentService.getPaymentCards();
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.status).toBe('success');
    expect(Array.isArray(body.data)).toBe(true);

  });
});