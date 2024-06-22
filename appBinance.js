const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

let firstBTCPrice = 0;
let currentTrade = "";
let intervalIdB = 0;
let intervalIdS = 0;
let tradequantity = 0.02;
let tradeTimes = 1;
let noofswitches = 1;

const Binance = require("binance-api-node").default;
const apiKey =
    "az28mFGG4ul5r112HSKIgisDgHV6CTq6AjuT5raFNVsko1ZGSjmBRB2sS4hDKgOX";
const apiSecret =
    "IYdTyi4jjyVDWF94KQ0ec9S9V7mykATX9PvazdAGkyqUOWMF5RyLxX4v6NPDaenh";
   

const client = Binance({
    apiKey: apiKey,
    apiSecret: apiSecret,
    httpBase: 'https://api.binance.com', // Optional
    timeout: 60000 // Set timeout to 60 seconds
  });

client.time().then((time) => console.log(`Server time: ${time}`));

// Base URL for Binance Futures API
const BASE_URL = "https://fapi.binance.com";

async function getServerTime() {
    try {
      const serverTime = await client.time();
      return serverTime;
    } catch (error) {
      console.error('Error fetching server time:', error);
      throw error;
    }
  }


// Create an Express application
const app = express();

// Middleware for parsing JSON bodies
app.use(bodyParser.text());

async function fetchBTCUSDTPrice() {
    try {
        const prices = await client.prices({ symbol: "BTCUSDT" });

        if (firstBTCPrice == 0) {
            firstBTCPrice = prices.BTCUSDT;
        }
        if (currentTrade == "BUY") {
            if (prices.BTCUSDT - firstBTCPrice > 200) {
                console.log("Exit BUY Trade with profit");
                firstBTCPrice = 0;
                const resultBUY = await client
                    .futuresOrder({
                        symbol: "BTCUSDT",
                        side: "SELL",
                        type: "LIMIT",
                        quantity: tradequantity * tradeTimes,
                        price: Math.round(prices.BTCUSDT) - 50, // specify your limit price here
                        timeInForce: "GTC", // Good Till Canceled (other options: 'IOC', 'FOK')
                    })
                    .then((_) => {
                        tradeTimes = 1;
                        clearInterval(intervalIdB);
                    });

                //remove
                clearInterval(intervalIdB);
                console.log( currentTrade + ' / ' + Math.round(prices.BTCUSDT));
                currentTrade = "";
            } else {
                console.log(
                    `The current price of BTC/USDT is: ${Number(prices.BTCUSDT).toFixed(
                        2
                    )}`,
                    `BUY Profit is : ${Number(prices.BTCUSDT - firstBTCPrice).toFixed(2)}`
                );
            }
        }

        if (currentTrade == "SELL") {
            if (firstBTCPrice - prices.BTCUSDT > 200) {
                console.log("Exit SELL Trade with profit");
                firstBTCPrice = 0;
                const resultSELL = await client
                    .futuresOrder({
                        symbol: "BTCUSDT",
                        side: "BUY",
                        type: "LIMIT",
                        quantity: tradequantity * tradeTimes,
                        price: Math.round(prices.BTCUSDT) + 50, // specify your limit price here
                        timeInForce: "GTC", // Good Till Canceled (other options: 'IOC', 'FOK')
                    })
                    .then((_) => {
                        tradeTimes = 1;
                        clearInterval(intervalIdS);
                    });
                //remove
                clearInterval(intervalIdS);
                console.log( currentTrade + ' / ' + Math.round(prices.BTCUSDT));
                currentTrade = "";
            } else {
                console.log(
                    `The current price of BTC/USDT is: ${Number(prices.BTCUSDT).toFixed(
                        2
                    )}`,
                    `SELL Profit is : ${Number(firstBTCPrice - prices.BTCUSDT).toFixed(
                        2
                    )}`
                );
            }
        }
    } catch (error) {
        console.error("Error fetching BTC/USDT price:", error);
    }
}


// Define a route handler for handling POST requests
app.post("/submit-form", async (req, res) => {
    //const pricesPost = await client.prices({ symbol: "BTCUSDT" });
    //console.log(await client.ping())
    //console.log(await client.futuresPing())
    //console.log(await client.exchangeInfo())
    // Extract data from the request body
    const formData = req.body;
    //console.log("Received: ", formData);
    let inputString = String(formData);
    console.log(
        "command:",
        inputString.split(" ")[0],
        "/",
        " value :",
        inputString.slice(-8)
    );
    const serverTime = await getServerTime();
    console.log('Binance Server Time:', serverTime);
    switch (inputString.split(" ")[0]) {
        case 'BUY':
            if (currentTrade == "") {//do it first time
                tradeTimes = 1;                
                const resultBUYFirst = await client.futuresOrder({
                    symbol: "BTCUSDT",
                    side: "BUY",
                    type: "LIMIT",
                    quantity: tradequantity * tradeTimes,
                    price: Math.round(parseFloat(inputString.slice(-8))) + 50, // specify your limit price here
                    timeInForce: "GTC", // Good Till Canceled (other options: 'IOC', 'FOK')
                });
                console.log( currentTrade + ' / ' + inputString.slice(-8));
                intervalIdB = setInterval(fetchBTCUSDTPrice, 1000);
                currentTrade = "BUY";
            } else {
                if (currentTrade == "SELL"){
                    clearInterval(intervalIdS);//close other trade and do counter trade
                    firstBTCPrice = 0;
                    tradeTimes = 2;
                    const resultBUY = await client.futuresOrder({
                        symbol: "BTCUSDT",
                        side: "BUY",
                        type: "LIMIT",
                        quantity: tradequantity * tradeTimes,
                        price: Math.round(parseFloat(inputString.slice(-8))) + 50, // specify your limit price here
                        timeInForce: "GTC", // Good Till Canceled (other options: 'IOC', 'FOK')
                    });
                    console.log( currentTrade + ' / ' + inputString.slice(-8));
                    intervalIdB = setInterval(fetchBTCUSDTPrice, 1000);
                    currentTrade = "BUY";
                    if (noofswitches == 5){
                        noofswitches = 1;
                        tradeTimes++
                    }else{
                        noofswitches++;
                    }

                }
            }
            // Set up a timer to fetch the price every second (1000 milliseconds)

            break;
        case 'SELL':
                console.log('REACHED');
                if (currentTrade == "") {
                    tradeTimes = 1;
                    console.log('Amt:', Math.round(parseFloat(inputString.slice(-8))) - 50);
                    const resultSELLFirst = await client.futuresOrder({
                        symbol: "BTCUSDT",
                        side: "SELL",
                        type: "LIMIT",
                        quantity: tradequantity * tradeTimes,
                        price: Math.round(parseFloat(inputString.slice(-8))) - 50, // specify your limit price here
                        timeInForce: "GTC", // Good Till Canceled (other options: 'IOC', 'FOK')
                    });
                    console.log( currentTrade + ' / ' + inputString.slice(-8));
                    currentTrade = "SELL";
                    // Set up a timer to fetch the price every second (1000 milliseconds)
                    intervalIdS = setInterval(fetchBTCUSDTPrice, 1000);
                } else {
                    if (currentTrade == "BUY"){
                        clearInterval(intervalIdB);
                    firstBTCPrice = 0;
                    tradeTimes = 2;
                    const resultSELL = await client.futuresOrder({
                        symbol: "BTCUSDT",
                        side: "SELL",
                        type: "LIMIT",
                        quantity: tradequantity * tradeTimes,
                        price: Math.round(parseFloat(inputString.slice(-8))) - 50, // specify your limit price here
                        timeInForce: "GTC", // Good Till Canceled (other options: 'IOC', 'FOK')
                    });
                    console.log( currentTrade + ' / ' + inputString.slice(-8));
                    currentTrade = "SELL";
                    // Set up a timer to fetch the price every second (1000 milliseconds)
                    intervalIdS = setInterval(fetchBTCUSDTPrice, 1000);                    
                    if (noofswitches == 5){
                        noofswitches = 1;
                        tradeTimes++
                    }else{
                        noofswitches++;
                    }
                    }                    
                }
            break;
    }

    // Process the form data (here, just sending it back as a response)
    res.json({ message: "Form submitted successfully", formData });
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
