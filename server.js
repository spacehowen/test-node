const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
let browser;

(async () => {
    browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
})();

app.get('/generate-iban', async (req, res) => {
    try {
        const page = await browser.newPage();
        await page.goto('http://www.randomiban.com/?country=Italy', { waitUntil: 'networkidle2' });

        const iban = await page.evaluate(() => {
            return document.querySelector('.ibandisplay').innerText;
        });

        await page.close();
        res.json({ iban });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error generating IBAN");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
