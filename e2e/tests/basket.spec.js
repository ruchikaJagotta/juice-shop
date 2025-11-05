import { test, expect } from '../fixtures/test.fixture';
import { PRODUCT_IDS } from '../data/product.data';


test.describe('Basket API Tests', () => {

  test('Get basket items with valid token ', async ({ authenticatedContext }) => {

    const { context, basketId } = authenticatedContext;
    const responseGetBasketItem = await context.get(`rest/basket/${basketId}`, {});

    const body = await responseGetBasketItem.json();
    expect(responseGetBasketItem.status()).toBe(200);
    expect(body.status).toBe('success');
  });

  test('should add item to basket', async ({ basketService, authenticatedContext , globalCleanup }) => {

    const { context, basketId } = authenticatedContext;
    const itemData = {
      ProductId: PRODUCT_IDS.OWASP_JUICE_SHOP_MUG,
      BasketId: basketId,
      quantity: 2,
    };

    const response = await basketService.addItem(itemData);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.status).toBe('success');
    expect(body.data.quantity).toBe(2);

  });

  test('should not be ble to add invalid quantity', async ({ basketService, authenticatedContext }) => {

    const { context, basketId } = authenticatedContext;
    const itemData = {
      ProductId: PRODUCT_IDS.APPLE_POMACE,
      BasketId: basketId,
      quantity: "abc",
    };
    const responseInvalidQuantity = await basketService.addItem(itemData);
    expect(responseInvalidQuantity.status()).toBe(400);

  });


  test('get basket items with invalid token', async ({ UnauthenticatedContext  }) => {

    const { context, basketId } = UnauthenticatedContext;
    const response = await context.get('/api/BasketItems/', {
    });

    expect(response.status()).toBe(401);
    expect(response.statusText()).toBe('Unauthorized');
  });

  test('should update basket item quantity', async ({ basketService, authenticatedContext ,globalCleanup}) => {
    const { context, basketId } = authenticatedContext;

    
    const itemData = {
      ProductId: PRODUCT_IDS.FRUI_PRESS,
      BasketId: basketId,
      quantity: 1,
    };
    const addResponse = await basketService.addItem(itemData);
    const addBody = await addResponse.json();
    const itemId = addBody.data.id;

    // Update quantity
    const updateResponse = await basketService.updateItemQuantity(itemId, 5);

    const updateBody = await updateResponse.json();
    expect(updateResponse.status()).toBe(200);
    expect(updateBody.status).toBe('success');
  });

  test('should not able to update item in wrong basket', async ({  authenticatedContext }) => {
    const { context, basketId } = authenticatedContext;   
    const addResponse = await context.post('/api/BasketItems/', {
      data: {
         ProductId: PRODUCT_IDS.ORANGE_JUICE,
           BasketId: 90999,
         quantity: 1,
       },
     });
    const status = await addResponse.status();
    expect(addResponse.status()).toBe(401);
    expect(addResponse.statusText()).toBe('Unauthorized');
  });

  test('should not update basket item quantity more than 5', async ({ basketService, authenticatedContext ,globalCleanup }) => {
    const { context, basketId } = authenticatedContext;
      const addResponse = await context.post('/api/BasketItems/', {
        data: {
          ProductId: PRODUCT_IDS.APPLE_JUICE,
          BasketId: basketId,
          quantity: 3,
        },
      });

    const addBody = await addResponse.json();
    const itemId = addBody.data.id;

    // Update quantity
    const updateResponse = await basketService.updateItemQuantity(itemId, 6);

    const updateBody = await updateResponse.json();
    expect(updateResponse.status()).toBe(400);
    expect(updateBody.error).toBe('You can order only up to 5 items of this product.');
  });



  test('should remove item from basket', async ({ basketService, authenticatedContext ,globalCleanup }) => {

    const { context, basketId } = authenticatedContext;
    
    const itemData = {
      ProductId: PRODUCT_IDS.JUICE_2,
      BasketId: basketId,
      quantity: 1,
    };
    const addResponse = await basketService.addItem(itemData);
    const addBody = await addResponse.json();
    const itemId = addBody.data.id;

    // Remove item
    const deleteResponse = await basketService.removeItem(itemId);
    const deleteBody = await deleteResponse.json();

    expect(deleteResponse.status()).toBe(200);
    expect(deleteBody.status).toBe('success');
  });

  test('should calculate basket total correctly', async ({ basketService, authenticatedContext , globalCleanup}) => {

    const { context, basketId } = authenticatedContext;

    
    await basketService.addItem({
      ProductId: PRODUCT_IDS.JUICE_5,
      BasketId: basketId,
      quantity: 2,
    });

    // Calculate total using service method
    const totalPrice = await basketService.calculateTotalPrice(basketId);

    expect(totalPrice).toBeGreaterThan(0);
    expect(typeof totalPrice).toBe('number');

  });
});
