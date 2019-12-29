let billingPage = function (driver, config) {
    let webdriver = require('selenium-webdriver'),
        By = webdriver.By,
        until = webdriver.until;

    let firstName = driver.findElement(By.name('customer.firstName'));
    let lastName = driver.findElement(By.name('customer.lastName'));
    let daytimePhone = driver.findElement(By.id('customer.dayPhone.formattedText'));
    let creditHeading = driver.findElement(By.id('cc-group-heading'));
    let creditAccountNumber = driver.findElement(By.id('ccAccountNumber'));
    let creditExpiryMonth = driver.findElement(By.id('ccExpiryDateMonth'));
    let creditMonthPicker = driver.findElement(By.css("#ccExpiryDateMonth option[value='" + config.expirationMM + "']"));
    let creditYearPicker = driver.findElement(By.css("#ccExpiryDateYear option[value='" + config.expirationYYYY + "']"));
    let cardholderName = driver.findElement(By.id('ccCardHolderName'));
    let accountNumber = driver.findElement(By.id('ccAccountNumber'));
    let cvv = driver.findElement(By.id('ccCvv'));

    this.fillInBillingInformation = function () {
        firstName.clear();
        firstName.sendKeys(config.firstName);
        lastName.clear();
        lastName.sendKeys(config.lastName)
        daytimePhone.sendKeys(`(${config.areaCode}) ${config.officeCode}-${config.lineNumber}`);

        driver.sleep(1000);
        creditHeading.click();
        driver.wait(until.elementIsVisible(
            creditAccountNumber, 3000));
        driver.wait(until.elementIsVisible(
            creditExpiryMonth, 3000));
        driver.sleep(1000);

        creditMonthPicker.click();
        creditYearPicker.click();
        cardholderName.clear();
        cardholderName.sendKeys(config.firstName + " " + config.lastName);
        accountNumber.sendKeys(config.ccAccount);
        cvv.sendKeys(config.cvv);
    }

    this.submitBillingInformation = function () {
        driver.findElement(By.name('continueButton')).click();
        driver.wait(until.elementLocated(By.id("make-payment-btn")));
        driver.findElement(By.css('label[for=acceptTermsAndConditions-1]')).click();
        driver.findElement(By.id('make-payment-btn')).click();
    }
};

module.exports = billingPage;
