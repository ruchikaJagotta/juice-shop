export class Validators {
  static isValidDutchPostcode(postcode) {
    const dutchPostcodeRegex = /^[1-9][0-9]{3}\s?[A-Z]{2}$/i;
    return dutchPostcodeRegex.test(postcode);
  }

  static isValidCreditCard(cardNumber) {
    // Luhn algorithm for credit card validation
    const digits = cardNumber.replace(/\D/g, '');
    
    if (digits.length < 13 || digits.length > 19) {
      return false;
    }

    let sum = 0;
    let isEven = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i], 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  static isValidPrice(price) {
    return price >= 0 && !isNaN(price) && isFinite(price);
  }
}
