import { BaseService } from './Base.service.js';

export class BasketService extends BaseService {
  constructor(request) {
    super(request);
  }

  async addItem(item) {
    const response = await this.request.post('/api/BasketItems/', {
      data: item,
    });

    return await this.handleResponse(response);
  }

  async updateItemQuantity(itemId, quantity) {
    const response = await this.request.put(`/api/BasketItems/${itemId}`, {
      data: { quantity },
    });

    return await this.handleResponse(response);
  }

  async removeItem(itemId) {
    const response = await this.request.delete(`/api/BasketItems/${itemId}`);
    return await this.handleResponse(response);
  }

  async getBasket(basketId) {
    const response = await this.request.get(`/rest/basket/${basketId}`);
    return await this.handleResponse(response);
  }

  async calculateTotalPrice(basketId) {
    const basket = await this.getBasket(basketId);
    const productDetails = await basket.json();
    let total = 0;
    productDetails.data.Products.forEach(product => {
      const price = product.price;
      const quantity = product.BasketItem.quantity;
      total += price * quantity;
    });
    return parseFloat(total.toFixed(2));
  }

  async clearBasket(basketId) {
    return this.request.delete(`/api/BasketItems/${basketId}`);
  }
}