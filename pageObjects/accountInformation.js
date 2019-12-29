let accountInformationPage = function (driver, config) {
    let webdriver = require('selenium-webdriver'),
        By = webdriver.By;

    let accountNumber = driver.findElement(By.name('header.accountNumber'));
    let zipCode = driver.findElement(By.id('header.authToken1'));
    let email = driver.findElement(By.id('customer.email'));
    let email2 = driver.findElement(By.id('customer.email2'));
    let continueButton = driver.findElement(By.name('continueButton'));

    this.fillInAccountInformation = function () {
        accountNumber.clear();
        accountNumber.sendKeys(config.accountNumber);

        zipCode.clear();
        zipCode.sendKeys(config.zipCode);

        email.clear();
        email.sendKeys(config.email);
        email2.clear();
        email2.sendKeys(config.email);

        continueButton.click();
    }
};

module.exports = accountInformationPage;
