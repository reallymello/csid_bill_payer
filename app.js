var webdriver = require('selenium-webdriver'),
    chrome = require('chromedriver'),
    fs = require('fs'),
    By = webdriver.By,
    until = webdriver.until;

var config = require('./config.js');
var promise = require('selenium-webdriver').promise;

var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
var d = new Date();
var fileName = monthNames[d.getMonth()] + ' ' + d.getFullYear().toString().substr(-2) + ".txt";

var driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build();

driver.get(config.loginUrl);
driver.findElement(By.id('email')).sendKeys(config.email);
driver.findElement(By.id('field')).sendKeys(config.password);
driver.findElement(By.css('h1')).click();
driver.findElement(By.id('button')).click();
driver.findElement(By.css("input[value='PayNow!']")).click();
driver.findElement(By.name('header.accountNumber')).clear();
driver.findElement(By.name('header.accountNumber')).sendKeys(config.accountNumber);
driver.findElement(By.name('customer.address.zipCode')).clear();
driver.findElement(By.name('customer.address.zipCode')).sendKeys(config.zipCode);
driver.findElement(By.name('submitBtn')).click();
driver.findElement(By.name('customer.firstName')).clear();
driver.findElement(By.name('customer.firstName')).sendKeys(config.firstName);
driver.findElement(By.name('customer.lastName')).clear();
driver.findElement(By.name('customer.lastName')).sendKeys(config.lastName);
driver.findElement(By.name('customer.dayPhone.npa')).sendKeys(config.areaCode);
driver.findElement(By.name('customer.dayPhone.nxx')).sendKeys(config.officeCode);
driver.findElement(By.name('customer.dayPhone.did')).sendKeys(config.lineNumber);
driver.findElement(By.name('customer.email')).clear();
driver.findElement(By.name('customer.email')).sendKeys(config.email);
driver.findElement(By.name('customer.email2')).clear();
driver.findElement(By.name('customer.email2')).sendKeys(config.email);
driver.findElement(By.css("option[value='CC']")).click();
driver.wait(until.elementLocated(By.css("option[value='" + config.cardType + "']")));
driver.findElement(By.css("option[value='" + config.cardType + "']")).click();
driver.findElement(By.name('paymentMethod.accountNumber')).sendKeys(config.ccAccount);
driver.findElement(By.name('paymentMethod.cvv')).sendKeys(config.cvv);
driver.findElement(By.css("select[name='paymentMethod.creditCardExpiryDate.month'] option[value='" + config.expirationMM + "']")).click();
driver.findElement(By.css("select[name='paymentMethod.creditCardExpiryDate.year'] option[value='" + config.expirationYYYY + "']")).click();
driver.findElement(By.name('paymentMethod.cardHolderName')).clear();
driver.findElement(By.name('paymentMethod.cardHolderName')).sendKeys(config.firstName + " " + config.lastName);
driver.findElement(By.name('submitBtn')).click();
driver.findElement(By.name('header.acceptTermsAndConditions')).click();
driver.findElement(By.name('submitBtn')).click();

driver.wait(until.elementLocated(By.css("tr")), 10000).then(tr => {
    var pendingRows = driver.findElements(By.css("tr"));

    pendingRows.then(function (elements) {
        var pendingHtml = elements.map(function (elem) {
            return elem.getText();
        });

        promise.all(pendingHtml).then(function (allHtml) {
            allHtml.length = allHtml.length - 4;

            var confirmationPage = "";
            for (var i = 6; i < allHtml.length; i++) {
                confirmationPage = confirmationPage + allHtml[i] + "\r\n";
            }

            console.log(confirmationPage);

            fs.writeFile(config.filePathForConfirmation + fileName, confirmationPage, (err) => {
                if (err) throw err;
                console.log('The file has been saved to ' +
                    config.filePathForConfirmation + fileName);
                driver.quit();
            });
        });
    });
});
