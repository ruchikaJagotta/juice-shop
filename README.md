# ![Juice Shop Logo](https://raw.githubusercontent.com/juice-shop/juice-shop/master/frontend/src/assets/public/images/JuiceShop_Logo_100px.png) OWASP Juice Shop


[![Custom CI/CD Pipeline](https://github.com/ruchikaJagotta/juice-shop/actions/workflows/node.js.yml/badge.svg)](https://github.com/ruchikaJagotta/juice-shop/actions/workflows/node.js.yml)

Forked [Readme_juiceshop](./README_Juiceshop.md)

# API Testing - Playwright

API tests for `Juice-shop` project are written using playwright javascript implementation. 

Frontend and backend implementation for `juice-shop` are forked from main repository. 

Test scenarios are located in `./e2e/tests` folder.

### Prerequisites

- Node.js 
- npm 
- git

### Installation

1. **Clone and setup the project locally**

- clone this repository and navigate to folder `juice-shop`

```bash
cd juice-shop
npm install
npm start
```
The application will be available at `http://localhost:3000`

## Running Tests

### Run tests locally
```bash
npx playwright test
```

### Run tests in CI/CD pipeline

```bash
npm run playwright:api
```

Individual test can be executed by below command. 
### Authentication tests
```bash
npx playwright test tests/auth.spec.js
```

### Basket Checkout tests
```bash
npx playwright test tests/auth.spec.js
```

### View test report
```bash
  npx playwright show-report
```
The application will be available at `http://localhost:9323/`

Other reporters could be configured with playwright reporter like `allure`. 
