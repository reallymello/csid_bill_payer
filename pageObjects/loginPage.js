let loginPage = function (driver, config) {
    let webdriver = require('selenium-webdriver'),
        By = webdriver.By,
        until = webdriver.until;

    driver.get(config.loginUrl);
    driver.findElement(By.css("button[data-dismiss=modal]")).click();
    driver.wait(until.elementIsNotVisible(
        driver.findElement(By.css("button[data-dismiss=modal]")), 7000));

    this.setEmail = function (email) {
        driver.findElement(By.id('email')).sendKeys(email);
    }

    this.setPassword = function (password) {
        driver.findElement(By.id('field')).sendKeys(password);
    }

    this.submit = function () {
        driver.wait(until.elementIsVisible(
            driver.findElement(By.css("button#login")), 5000));
        driver.findElement(By.css('button#login')).click();
    }
};

module.exports = loginPage;
