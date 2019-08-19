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

// Login
driver.get(config.loginUrl);
driver.findElement(By.id('email')).sendKeys(config.email);
driver.findElement(By.id('field')).sendKeys(config.password);
driver.findElement(By.css('h1')).click();
driver.findElement(By.id('button')).click();
driver.findElement(By.css("input[value='PayNow!']")).click();

// Enter account information and continue.
driver.findElement(By.name('header.accountNumber')).clear();
driver.findElement(By.name('header.accountNumber')).sendKeys(config.accountNumber);
driver.findElement(By.id('header.authToken1')).clear();
driver.findElement(By.id('header.authToken1')).sendKeys(config.zipCode);
driver.findElement(By.id('customer.email')).clear();
driver.findElement(By.id('customer.email')).sendKeys(config.email);
driver.findElement(By.id('customer.email2')).clear();
driver.findElement(By.id('customer.email2')).sendKeys(config.email);
driver.findElement(By.name('continueButton')).click();

// Fill payment details.
driver.findElement(By.name('customer.firstName')).clear();
driver.findElement(By.name('customer.firstName')).sendKeys(config.firstName);
driver.findElement(By.name('customer.lastName')).clear();
driver.findElement(By.name('customer.lastName')).sendKeys(config.lastName)
driver.findElement(By.id('customer.dayPhone.formattedText')).sendKeys(
    `(${config.areaCode}) ${config.officeCode}-${config.lineNumber}`
);
driver.sleep(1000);
driver.findElement(By.id('cc-group-heading')).click();
driver.wait(until.elementIsVisible(
    driver.findElement(By.id('ccAccountNumber')), 3000));
driver.wait(until.elementIsVisible(
    driver.findElement(By.id('ccExpiryDateMonth')), 3000));
driver.sleep(1000);
driver.findElement(By.css("#ccExpiryDateMonth option[value='" + config.expirationMM + "']")).click();
driver.findElement(By.css("#ccExpiryDateYear option[value='" + config.expirationYYYY + "']")).click();
driver.findElement(By.id('ccCardHolderName')).clear();
driver.findElement(By.id('ccCardHolderName')).sendKeys(config.firstName + " " + config.lastName);
driver.findElement(By.id('ccAccountNumber')).sendKeys(config.ccAccount);
driver.findElement(By.id('ccCvv')).sendKeys(config.cvv);
driver.findElement(By.name('continueButton')).click();

driver.wait(until.elementLocated(By.id("make-payment-btn")));
driver.findElement(By.css('label[for=acceptTermsAndConditions-1]')).click();
driver.findElement(By.id('make-payment-btn')).click();

// Save receipt to disk.
driver.wait(until.elementLocated(By.css("p[data-id=confirmation-number-header]")));
driver.wait(until.elementLocated(By.css(".step.receiptContent")), 20000).then(x => {
    var pendingRows = driver.findElements(By.css("div.grid.grid-receipt div.item-row"));
    pendingRows.then(function (elements) {
        var pendingHtml = elements.map(function (elem) {
            return elem.getText();
        });

        promise.all(pendingHtml).then(function (allHtml) {
            allHtml.pop();
            
            var confirmationPage = "";
            for (var i = 0; i < allHtml.length; i++) {
                let formattedLine = allHtml[i].replace(/(\r\n|\n|\r)/gm, "\t");
                confirmationPage = confirmationPage + formattedLine + "\r\n";
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
