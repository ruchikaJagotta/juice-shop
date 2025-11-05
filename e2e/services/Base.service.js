export class BaseService {
  constructor(request) {
    this.request = request; // Playwright's APIRequestContext
  }

  async handleResponse(response) {
    const status = response.status();
    const body = await response.json();

    if (status > 400) {
      throw new Error(`API Error: ${status} - ${JSON.stringify(body)}`);
    }

    return response;
  }
}
