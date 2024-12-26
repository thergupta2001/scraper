const express = require('express');
const path = require('path');
const scrapeX = require('./scraper.js');
const { exec } = require('child_process');
const os = require('os');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/run-scraper', async (req, res) => {
    try {
        let chromeCommand = '';
        
        if (os.platform() === 'win32') {
            // For windows, ensure that the Chrome executable path is correct
            // Replace <Username> with your actual username in PC, replace <Username> with process.env.PC_USERNAME here, like in Linux
            const chromePath = `"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"`;
            const userDataDir = `"C:\\Users\\<Username>\\AppData\\Local\\Google\\Chrome\\User Data"`;
            chromeCommand = `${chromePath} --remote-debugging-port=9222 --user-data-dir=${userDataDir} --profile-directory="Profile 1"`;
        } else if (os.platform() === 'linux') {
            // For Linux, ensure that the Chrome executable path is correct
            // Replace <Username> with your actual username in Linux
            const chromePath = 'google-chrome'; 
            const userDataDir = `/home/${process.env.PC_USERNAME}/.config/google-chrome`;
            chromeCommand = `${chromePath} --remote-debugging-port=9222 --user-data-dir=${userDataDir} --profile-directory="Profile 1"`;
        }

        exec(chromeCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
        });

        const result = await scrapeX();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
