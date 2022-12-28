const fs = require('fs');
const { By } = require('selenium-webdriver');
const webdriver = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');

(async () => {
    const options = new firefox.Options().addExtensions('./extension.zip').headless();

    const driver = new webdriver.Builder().forBrowser(webdriver.Browser.FIREFOX).setFirefoxOptions(options).build();
    const addonId = await driver.installAddon('./build', true);

    const capabilities = await driver.getCapabilities();
    const profile = capabilities.get('moz:profile');
    setTimeout(async () => {
        const prefs = fs.readFileSync(`${profile}/prefs.js`);
        const extensionUuid = getExtensionUuid(prefs.toString(), addonId);

        await driver.get(`moz-extension://${extensionUuid}/index.html`);

        const accountsButton = await driver.findElement(By.xpath('/html/body/div/div/div[1]/div[2]/button[1]'));
        accountsButton.click();
    }, 5000);
})();

const getExtensionUuid = (prefsFileContent, addonId) => {
    if (!prefsFileContent) return null;

    let uuid = null;

    const userPrefsList = prefsFileContent.split(';');

    userPrefsList.forEach((pref) => {
        if (pref.includes('extensions.webextensions.uuids')) {
            let uuids = pref.split('user_pref("extensions.webextensions.uuids",')[1];
            uuids = uuids.substring(0, uuids.length - 1);
            const parsedUuids = JSON.parse(JSON.parse(uuids));

            uuid = parsedUuids[addonId];
        }
    });

    return uuid;
};
