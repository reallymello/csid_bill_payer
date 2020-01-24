let confirmationPage = function (driver, config) {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

    let webdriver = require('selenium-webdriver'),
        By = webdriver.By,
        until = webdriver.until,
        promise = require('selenium-webdriver').promise,
        fs = require('fs');

    let d = new Date();
    let fileName = monthNames[d.getMonth()] + ' ' + d.getFullYear().toString().substr(-2) + ".txt";

    this.saveReceipt = function () {
        driver.wait(until.elementLocated(By.css("p[data-id=confirmation-number-header]")));
        driver.wait(until.elementLocated(By.css(".step.receiptContent")), 20000).then(x => {
            var pendingRows = driver.findElements(By.css("div.grid.grid-receipt div.item-row"));
            pendingRows.then(function (elements) {
                var pendingHtml = elements.map(function (elem) {
                    return elem.getText();
                });

                promise.all(pendingHtml).then(function (allHtml) {
                    allHtml.pop();

                    var confirmationPageInfo = "";
                    for (var i = 0; i < allHtml.length; i++) {
                        let formattedLine = allHtml[i].replace(/(\r\n|\n|\r)/gm, "\t");
                        confirmationPageInfo = confirmationPageInfo + formattedLine + "\r\n";
                    }

                    console.log(confirmationPageInfo);

                    fs.writeFile(config.filePathForConfirmation + fileName, confirmationPageInfo, (err) => {
                        if (err) throw err;
                        console.log('The file has been saved to ' +
                            config.filePathForConfirmation + fileName);
                        driver.quit();
                    });
                });
            });
        });
    };
}

module.exports = confirmationPage;
