# Twitter Trends Scraper

This project allows you to scrape Twitter's trending topics using Selenium WebDriver and display the results in a simple frontend. It also includes an Express server to trigger the scraper and show the results. You can scrape Twitter trends by visiting the server's URL and clicking a button.

## Prerequisites

Ensure that the following are installed:

- **Node.js**: [Download Node.js](https://nodejs.org/)
- **Google Chrome**: Install Google Chrome on your system.
- **MongoDB**: Install MongoDB locally or use a cloud instance like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
- **Selenium WebDriver**: The `selenium-webdriver` npm package will be used for web scraping.
- **Google Chrome Driver**: Install ChromeDriver to allow Selenium to control Google Chrome.
- **ProxyMesh**: Login to ProxyMesh, and use those credentials in the .env file. Also the free URL starting with 'us.proxymesh.com' with Port number must be used in .env file.

For **Ubuntu** users, follow these steps to install dependencies:

## Getting Started

### Step 1: Clone the Repository

To get started with the project, clone the repository to your local machine using the following command:

```bash
git clone <repository-url>
```

### Step 2: Install Dependencies

After cloning the repository, you need to install the project dependencies. Run the following command to install all required packages:

```bash
npm install
```

### Step 3: Set Up Environment Variables

To configure the project, you need to set up the environment variables. First, clone the `.env.sample` file to create your `.env` file:

```bash
cp .env.sample .env
```

### Step 4: Run the Application

Once you have installed the dependencies and set up the environment variables, you can start the application by running the following command:

```bash
npm start
```

### Important Step:
Before running the application, first open your Chrome profile, log into x.com, and close it. Afterward, run the application using Step 4, open http://localhost:3000 in a different browser (such as Brave, Firefox, etc.) to trigger the scraper. This ensures that the Chrome profile is correctly loaded with your login credentials, allowing the scraper to access the necessary data.

This step must be followed before clicking the "Click here to run the script" button in the application.