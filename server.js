const puppeteer = require('puppeteer');
const express = require('express');

const app = express();

app.get('/generate-iban', async (req, res) => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.goto('http://www.randomiban.com/?country=Italy', { waitUntil: 'networkidle2' });

    const iban = await page.evaluate(() => {
        return document.querySelector('.ibandisplay').innerText;
    });

    await browser.close();
    res.json({ iban });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
