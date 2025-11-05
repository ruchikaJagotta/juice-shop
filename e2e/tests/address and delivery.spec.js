import { test, expect } from '../fixtures/test.fixture';
import { NL_ADDRESS, VALID_NL_POSTCODES } from '../data/address.data';
import { Validators } from '../utils/validators';

test.describe('Address API Tests', () => {


  test('should add valid NL address', async ({ addressService,  authenticatedContext , globalCleanup }) => {
   const { context, basketId } = authenticatedContext;
    const response = await addressService.addAddress(NL_ADDRESS);

    const body = await response.json();
    expect(response.status()).toBe(201);
    expect(body.status).toBe('success');
    globalCleanup.trackAddress(body.data.id);
    expect(body.data.country).toBe(NL_ADDRESS.country);
    expect(body.data.zipCode).toBe(NL_ADDRESS.zipCode);

  });

   test('should validate Dutch postcodes', () => {
    VALID_NL_POSTCODES.forEach(postcode => {
      expect(Validators.isValidDutchPostcode(postcode)).toBe(true);
    });

    // Invalid postcodes
    expect(Validators.isValidDutchPostcode('0123AB')).toBe(false);
    expect(Validators.isValidDutchPostcode('12345')).toBe(false);
    expect(Validators.isValidDutchPostcode('ABCD12')).toBe(false);
  });

  test('should get all addresses', async ({ addressService , authenticatedContext }) => {

  const { context } = authenticatedContext;
  const response = await addressService.getAddresses();

    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.status).toBe('success');
    expect(Array.isArray(body.data)).toBe(true);
  });

  test('should get all delivery methods', async ({ addressService ,authenticatedContext }) => {

  const { context } = authenticatedContext;
    const response = await addressService.getDeliveryMethods();
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.status).toBe('success');
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data[0].name).toEqual('One Day Delivery');
    expect(body.data[1].name).toEqual('Fast Delivery');
  });


});
