import { BaseService } from './Base.service.js';

export class AuthService extends BaseService {
  constructor(request) {
    super(request);
  }

  async register(userData) {
    const response = await this.request.post('/api/Users/', {
      data: userData,
    });

    return await this.handleResponse(response);
  }

  async login(credentials) {
    const response = await this.request.post('/rest/user/login', {
      data: credentials,
    });
    
    const body = await response.json();
    return body;
  }

}
