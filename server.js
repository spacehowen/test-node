const puppeteer = require('puppeteer');
const express = require('express');

const app = express();

app.get('/generate-iban', async (req, res) => {
    // Obtener el país desde el parámetro de consulta
    const country = req.query.country;

    // Validar el país y construir la URL
    const validCountries = ['Italy', 'Germany', 'France'];
    if (!validCountries.includes(country)) {
        return res.status(400).json({ error: 'Invalid country. Valid options are: Italy, Germany, France.' });
    }
    const url = `http://www.randomiban.com/?country=${country}`;

    try {
        const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });

        const iban = await page.evaluate(() => {
            return document.querySelector('.ibandisplay').innerText;
        });

        await browser.close();
        res.json({ iban });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate IBAN.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
