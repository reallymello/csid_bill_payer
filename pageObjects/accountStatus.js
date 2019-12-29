let accountStatus = function (driver) {
    let webdriver = require('selenium-webdriver'),
        By = webdriver.By;

    this.payNow = function () {
        driver.findElement(By.css('h2')).click();
        driver.findElement(By.css("input[value='PayNow!']")).click();
    }
};

module.exports = accountStatus;
