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
//driver.get(config.loginUrl);
//driver.findElement(By.id('email')).sendKeys(config.email);
//loginPage.emailTextBox.sendKeys(config.email);

let loginPage = require('./pageObjects/loginPo.js');

var lp = new loginPage(driver, config);
lp.fillInEmail(config.email);
//console.log(lp.fillInEmail())

//driver.quit();