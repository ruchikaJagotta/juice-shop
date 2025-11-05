import { BaseService } from './Base.service.js';

export class PaymentService extends BaseService {
  constructor(request) {
    super(request);
  }

  async addPaymentCard(card) {
    const response = await this.request.post('/api/Cards/', {
      data: card,
    });
    
    return await this.handleResponse(response);
  }

  async getPaymentCards() {
    const response = await this.request.get('/api/Cards/');
    return await this.handleResponse(response);
  }

  async deletePaymentCard(cardId) {
    const response = await this.request.delete(`/api/Cards/${cardId}`);
    return await this.handleResponse(response);
  }
}