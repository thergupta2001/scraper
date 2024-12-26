const { Builder, By, until } = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/chrome');
const MongoClient = require('mongodb');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

const MONGO_URI = 'mongodb://localhost:27017';
const DB_NAME = 'scraper';
const COLLECTION_NAME = 'trends';

const PROXY_HOST = process.env.PROXYMESH_URL;
const PROXY_PORT = process.env.PROXYMESH_PORT;
const PROXY_USER = process.env.PROXYMESH_USERNAME;
const PROXY_PASS = process.env.PROXYMESH_PASSWORD;

async function scrapeX() {
    const client = new MongoClient.MongoClient(MONGO_URI);
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const uniqueId = uuidv4();

    const proxy = `http://${PROXY_USER}:${PROXY_PASS}@${PROXY_HOST}:${PROXY_PORT}`;
    const profilePath = '/home/rohangupta/.config/google-chrome';
    const profileName = 'Profile 1'; // Use the specific profile name

    const options = new Options();
    options.addArguments(`--user-data-dir=${profilePath}`);
    options.addArguments(`--profile-directory=${profileName}`);
    options.addArguments(`--proxy-server=${proxy}`);
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--remote-debugging-port=9222');

    const driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    try {
        // Navigate to x.com/home
        await driver.get("https://x.com/home");

        await driver.wait(until.elementLocated(By.css('div[aria-label="Timeline: Trending now"]')), 10000);

        const trendsSection = await driver.findElement(By.css('div[aria-label="Timeline: Trending now"]'));
        const trendElements = await trendsSection.findElements(By.css('div[data-testid="trend"] span'));

        const trendsSet = new Set(); 
        for (let element of trendElements) {
            const text = await element.getText();

            if (text) {
                trendsSet.add(text.trim());
            }
        }

        let trends = Array.from(trendsSet);

        // Filter out unwanted words or phrases
        const unwantedPhrases = [
            "Only on X",
            "Trending",
            "News ·",
            "Politics ·",
            "Travel ·",
            "posts",
            "Trending in"
        ];
        trends = trends.filter(trend => {
            return !unwantedPhrases.some(phrase => trend.includes(phrase));
        });

        const ipResponse = await axios.get('https://api.ipify.org?format=json', { proxy: false });
        const ipAddress = ipResponse.data.ip;

        const endTime = new Date();
        const document = { uniqueId, trends, ipAddress, endTime };
        await collection.insertOne(document);

        // console.log('Scraping completed and saved:', document);
        return document;
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await driver.quit();
        await client.close();
    }
}

module.exports = scrapeX;

