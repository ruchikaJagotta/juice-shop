import { test as base, expect, request as playwrightRequest } from '@playwright/test';
import { AuthService } from '../services/Auth.service.js';
import { BasketService } from '../services/Basket.service.js';
import { AddressService } from '../services/Address.service.js';
import { PaymentService } from '../services/Payment.service.js';
import { userData } from '../data/user.js';

let registered = false;

export const test = base.extend({
  authService: async ({ request }, use) => {
    const authService = new AuthService(request);
    await use(authService);
  },

  authenticatedContext: async ({ authService }, use) => {

    if (!registered) {
      await authService.register(userData);
      registered = true;
    }

    const loginResponse = await authService.login({
      email: userData.email,
      password: userData.password,
    });

    const token = loginResponse.authentication.token;
    const basketId = loginResponse.authentication.bid;

    // Create an authenticated API request context with httpsHeaders
    const context = await playwrightRequest.newContext({
      extraHTTPHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    await use({ context, basketId });

    await context.dispose();
  },

  UnauthenticatedContext: async ({ authService }, use) => {

    if (!registered) {ss
      await authService.register(userData);
      registered = true;
    }

    const loginResponse = await authService.login({
      email: userData.email,
      password: userData.password,
    });

    const token = loginResponse.authentication.token;
    const basketId = loginResponse.authentication.bid;

    // Unauthenticated API request context
    const context = await playwrightRequest.newContext({
      extraHTTPHeaders: {
        Authorization: `Bearer123 ${token}`,
      },
    });

    await use({ context, basketId });

    // Cleanup
    await context.dispose();
  },

  basketService: async ({ authenticatedContext }, use) => {
    const basketService = new BasketService(authenticatedContext.context);
    await use(basketService);
  },

  addressService: async ({ authenticatedContext }, use) => {
    const addressService = new AddressService(authenticatedContext.context);
    await use(addressService);
  },

  paymentService: async ({ authenticatedContext }, use) => {
    const paymentService = new PaymentService(authenticatedContext.context);
    await use(paymentService);
  },

  globalCleanup: async ({ basketService, addressService, paymentService, authenticatedContext }, use) => {
    const createdAddresses = [];
    const createdCards = [];

    await use({
      trackAddress: (id) => createdAddresses.push(id),
      trackCard: (id) => createdCards.push(id)
    });
    const { basketId } = authenticatedContext;


    try {
      await basketService.clearBasket(basketId);
    } catch (err) {
      console.warn("Cleanup error for basket", err);
    }

    for (const id of createdAddresses) {
      try {
        await addressService.deleteAddress(id);
      } catch (err) {
        console.warn('Clean up error for address ', err);
      }
    }

    for (const id of createdCards) {
      try {
        await paymentService.deletePaymentCard(id);
      } catch (err) {
        console.warn('Clean up error for cards ', err);
      }
    }
  }

});

export { expect };
