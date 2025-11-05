import { getRandomEmail } from '../utils/randomEmailGenerator.js';

export const userData = {
  email: getRandomEmail(),
  password: 'Password@1234$%$',
  passwordRepeat: 'Password@1234$%$',
  securityAnswer: 'Don',
    securityQuestion: {
    id: 1,
    question: "Your eldest siblings middle name?",
  },
};
