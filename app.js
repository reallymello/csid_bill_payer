const webdriver = require('selenium-webdriver'),
    chrome = require('chromedriver'),
    fs = require('fs'),
    By = webdriver.By,
    until = webdriver.until;

const driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build();

let config = require('./config.js'),
    loginPage = new require('./pageObjects/loginPage.js'),
    accountStatusPage = new require('./pageObjects/accountStatus.js'),
    accountInformationPage = new require('./pageObjects/accountInformation.js'),
    billingPage = new require('./pageObjects/billingPage.js'),
    confirmationPage = new require('./pageObjects/confirmationPage.js');

// Login
let login = new loginPage(driver, config);
login.setEmail(config.email);
login.setPassword(config.password);
login.submit();

// Continue from billing summary
let accountStatus = new accountStatusPage(driver);
accountStatus.payNow();

// Fill in the account information
let accountInfo = new accountInformationPage(driver, config);
accountInfo.fillInAccountInformation();

// Fill in credit billing information
let billing = new billingPage(driver, config);
billing.fillInBillingInformation();
billing.submitBillingInformation();

// Save confirmation receipt to disk and quit
let confirmPage = new confirmationPage(driver, config);
confirmPage.saveReceipt();
