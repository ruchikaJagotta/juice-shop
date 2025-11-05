import { test, expect } from '../fixtures/test.fixture.js';
import { TEST_PRODUCTS } from '../data/product.data.js';
import { NL_ADDRESS } from '../data/address.data.js';
import { VALID_NL_CARD } from '../data/payment.data.js';
import { Validators } from '../utils/validators.js';
import { Logger } from '../utils/logger.js';

const logger = Logger.getInstance();

test('Complete Checkout Flow – Add Items → Add Address → Payment → Checkout', async ({ authenticatedContext, globalCleanup }) => {
    const { context, basketId } = authenticatedContext;

    let basketItemIds = [];
    let addressId;
    let paymentId;
    let deliveryMethodId;
    let calculatedTotal = 0;

    // Step 1 – Add Items
    await test.step('Add 5 items to basket', async () => {
        logger.info(`Adding ${TEST_PRODUCTS.length} items to basket`);

        for (const product of TEST_PRODUCTS) {
            const response = await context.post('/api/BasketItems/', {
                data: {
                    ProductId: product.id,
                    BasketId: basketId,
                    quantity: product.quantity,
                },
            });

            const body = await response.json();
            expect(response.status()).toBe(200);
            expect(body.status).toBe('success');

            basketItemIds.push(body.data.id);
        }

        logger.info('All items added', { count: basketItemIds.length });
    });

    // Step 2 – Verify Basket
    await test.step('Verify basket contains correct items', async () => {
        const response = await context.get(`/rest/basket/${basketId}`);
        const body = await response.json();

        expect(response.status()).toBe(200);
        expect(body.data.Products.length).toBeGreaterThanOrEqual(TEST_PRODUCTS.length);

        logger.info('Basket verified');
    });

    // Step 3 – Remove one item
    await test.step('Remove one item from basket', async () => {
        const itemToRemove = basketItemIds[0];

        const response = await context.delete(`/api/BasketItems/${itemToRemove}`);
        const body = await response.json();

        expect(body.status).toBe('success');

        basketItemIds = basketItemIds.filter(id => id !== itemToRemove);
        logger.info('Item removed', { remaining: basketItemIds.length });
    });

    // Step 4 – Update quantity
    await test.step('Update quantity of item', async () => {
        const itemToUpdate = basketItemIds[0];
        const newQty = 5;

        const response = await context.put(`/api/BasketItems/${itemToUpdate}`, {
            data: { quantity: newQty },
        });

        expect(response.status()).toBe(200);
        logger.info('Item quantity updated');
    });

    // Step 5 – Calculate total price
    await test.step('Validate total price', async () => {
        const response = await context.get(`/rest/basket/${basketId}`);
        const body = await response.json();

        for (const product of body.data.Products) {
            const subtotal = product.price * product.BasketItem.quantity;
            calculatedTotal += subtotal;
        }

        calculatedTotal = Number(calculatedTotal.toFixed(2));

        expect(Validators.isValidPrice(calculatedTotal)).toBe(true);
        logger.info('Total price calculated', { calculatedTotal });
    });

    // Step 6 – Add Address
    await test.step('Add NL address', async () => {
        const response = await context.post('/api/Addresss/', {
            data: NL_ADDRESS,
        });

        const body = await response.json();
        expect(body.status).toBe('success');

        addressId = body.data.id;
        await globalCleanup.trackAddress(addressId);
        logger.info('Address added', { addressId });
    });

    // Step 7 – Select Delivery Method
    await test.step('Select delivery method', async () => {
        const response = await context.get('/api/Deliverys/');
        const body = await response.json();

        deliveryMethodId = body.data[0].id;
        logger.info('Delivery method selected', { deliveryMethodId });
    });

    // Step 8 – Add Payment Card
    await test.step('Add payment card', async () => {
        const response = await context.post('/api/Cards/', {
            data: VALID_NL_CARD,
        });

        const body = await response.json();
        expect(body.status).toBe('success');

        paymentId = body.data.id;
        await globalCleanup.trackCard(paymentId);
        logger.info('Payment card added', { paymentId });
    });

    // Step 9 – Review Order Summary
    await test.step('Review order summary', async () => {
        const basket = await context.get(`/rest/basket/${basketId}`).then(r => r.json());
        const addresses = await context.get('/api/Addresss/').then(r => r.json());
        const cards = await context.get('/api/Cards/').then(r => r.json());

        expect(addresses.data.find(a => a.id === addressId)).toBeDefined();
        expect(cards.data.find(c => c.id === paymentId)).toBeDefined();

        logger.info('Order summary verified');
    });

    // Step 10 – Checkout
    await test.step('Place order', async () => {
        const checkoutResponse = await context.post(`/rest/basket/${basketId}/checkout`, {
            data: {
                couponData: 'bnVsbA==',
                orderDetails: {
                    paymentId: paymentId.toString(),
                    addressId: addressId.toString(),
                    deliveryMethodId: deliveryMethodId.toString(),
                },
            },
        });

        const checkoutJson = await checkoutResponse.json();
        expect(checkoutResponse.status()).toBe(200);

        const orderResponse = await context.get(`/rest/track-order/${checkoutJson.orderConfirmation}`);
        const orderJson = await orderResponse.json();

        //Validate total price 
        const totalWithoutDelivery =
            orderJson.data[0].totalPrice - orderJson.data[0].deliveryPrice;

        expect(Number(totalWithoutDelivery.toFixed(2))).toBe(calculatedTotal);

        logger.info('Order placed successfully', {
            orderId: checkoutJson.orderConfirmation,
        });
    });
});
