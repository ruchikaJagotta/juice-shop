import { BaseService } from './Base.service.js';

export class AddressService extends BaseService {
  constructor(request) {
    super(request);
  }

  async addAddress(address) {
    const response = await this.request.post('/api/Addresss/', {
      data: address,
    });
    return await this.handleResponse(response);
  }

  async getAddresses() {
    const response = await this.request.get('/api/Addresss/');
    return await this.handleResponse(response);
  }

   async getDeliveryMethods() {
    const response = await this.request.get('/api/Deliverys');
    return await this.handleResponse(response);
  }

  async deleteAddress(addressId) {
    const response = await this.request.delete(`/api/Addresss/${addressId}`);
    return await this.handleResponse(response);
  }

}