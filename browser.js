import { firefox, devices } from 'playwright';
import { join, dirname } from 'path';
import { connect } from './node_modules/web-ext/lib/firefox/remote.js';

import { fileURLToPath } from 'url';

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

    const browserContext = await browser.newContext({
        storageState: {
            origins: [
                {
                    origin: addonPage,
                    localStorage: [
                        {
                            name: 'token',
                            value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjMzMDZhMmRlNmRkNjg5MWJlMDFkY2ZjIn0sImlhdCI6MTY2NDExNzI5M30.hYSTv5foYIPHwBfFZc6gzPebKfzLLs8B-fwcuHDGhvk',
                        },
                    ],
                },
            ],
        },
    });

    const page = await browserContext.newPage();
    await page
        .goto(addonPage, {
            waitUntil: 'domcontentloaded',
            timeout: 1000,
        })
        .catch(() => {});
})();
