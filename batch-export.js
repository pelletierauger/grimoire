const puppeteer = require('puppeteer');

(async() => {
    let batchMin;
    let batchMax;
    if (process.argv[2] && process.argv[3]) {
        batchMin = process.argv[2];
        batchMax = process.argv[3];
        // console.log(process.argv[2]);
        const browser = await puppeteer.launch({
            headless: false,
            args: [
                '--headless',
                '--hide-scrollbars',
                '--mute-audio'
            ]
        });
        // await console.log("Puppeteer launched");
        const page = await browser.newPage();
        await page.setViewport({
            width: 2560 / 2,
            height: 1600 / 2,
            deviceScaleFactor: 2
        });
        // await console.log(page.viewport());
        await page.goto('http://localhost:8080/?batchmin=' + batchMin + '&batchmax=' + batchMax);
        // await page.screenshot({ path: 'example.png' });
        // await browser.close();
    } else {
        console.log("The first and last frames to be exported must be provided as arguments.");
    }
})();