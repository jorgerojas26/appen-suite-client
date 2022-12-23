import { firefox, devices } from 'playwright';
import { join, dirname } from 'path';
import { connect } from './node_modules/web-ext/lib/firefox/remote.js';

import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

const RDP_PORT = 12345;

const __filename = fileURLToPath(import.meta.url);

const extensionPath = join(dirname(__filename), './build');

(async () => {
    const browser = await firefox.launch({
        headless: false,
        args: ['-start-debugger-server', String(RDP_PORT)],
        firefoxUserPrefs: {
            'devtools.debugger.remote-enabled': true,
            'devtools.debugger.prompt-connection': false,
        },
    });

    const client = await connect(RDP_PORT);
    const resp = await client.installTemporaryAddon(extensionPath);
    const addon = await client.getInstalledAddon(resp.addon.id);
    const addonPage = addon.manifestURL.replace('manifest.json', 'index.html');

    const browserContext = await browser.newContext(devices['Desktop Firefox']);

    const page = await browserContext.newPage();
    page.goto(addonPage, {
        waitUntil: 'networkidle',
        timeout: 0,
    });
    await page.waitForURL(addonPage);
    console.log('hola');
})();
