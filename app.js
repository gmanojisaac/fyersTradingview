const express = require("express");
const bodyParser = require("body-parser");
//var fyersModel = require("fyers-api-v3").fyersModel;
//let DataSocket = require("fyers-api-v3").fyersDataSocket;
//var fyersOrderSocket = require("fyers-api-v3").fyersOrderSocket;
const axios = require("axios");
//var fyers = new fyersModel({ "logs": "path where you want to save logs", "enableLogging": false })
const Binance = require("binance-api-node").default;
const apiKey =
    "az28mFGG4ul5r112HSKIgisDgHV6CTq6AjuT5raFNVsko1ZGSjmBRB2sS4hDKgOX";
const apiSecret =
    "IYdTyi4jjyVDWF94KQ0ec9S9V7mykATX9PvazdAGkyqUOWMF5RyLxX4v6NPDaenh";

// const client = Binance({
//     apiKey: key,
//     apiSecret: secret,
//     beautifyResponses: true,
//   });

// Authenticated client, can make signed calls
const client = Binance({
    apiKey: apiKey,
    apiSecret: apiSecret,
});

client.time().then((time) => console.log(`Server time: ${time}`));

// Base URL for Binance Futures API
const BASE_URL = "https://fapi.binance.com";

// Function to get market price of a symbol
async function getTickerPrice(symbol) {
    try {
        const response = await axios.get(`${BASE_URL}/fapi/v1/ticker/price`, {
            params: { symbol: symbol },
        });
        console.log(`Price of ${symbol}:`, response.data);
    } catch (error) {
        console.error(`Error fetching price for ${symbol}:`, error);
    }
}

//working
//   const { USDMClient } = require('binance');
//   const client = new USDMClient({
//     api_secret: secret,
//     api_key: key
//   });
//   client
//   .getBalance()
//   .then((result) => {
//     console.log('getBalance result: ', result);
//   })
//   .catch((err) => {
//     console.error('getBalance error: ', err);
//   });

// Create an Express application
const app = express();

// Middleware for parsing JSON bodies
app.use(bodyParser.text());
let textreceived = "";
let textindex = 0;
let higherindex = 0;
let lowerindex = 0;
let alreadyintrade = false;
let subscribeList = [];
let GenericTagCEPE = "NSE:NIFTY24620";
let BGenericTagCEPE = "NSE:BANKNIFTY24619";
let BNiftyCE = "";
let BNiftyPE = "";
let NiftyCE = "";
let NiftyPE = "";

let LBNiftyCE = "";
let LBNiftyPE = "";
let LNiftyCE = "";
let LNiftyPE = "";

let TBNiftyCE = 0;
let TBNiftyPE = 0;
let TNiftyCE = 0;
let TNiftyPE = 0;

let Btradeside = "";
let BtradeDirection = "";
let BTagsReceivedState = false;
let Btradevalue = 0;
let BCurrentTrade = "";
let BTradeLossper = 0;
let BAbsoluteLoss = 0;
let BTradex = 1;
let BLastCEValue = 0;
let BLastPEValue = 0;
let firstBTCPrice = 0;
let currentTrade = "";
let intervalIdB = 0;
let intervalIdS = 0;
let tradequantity = 0.02;
let tradeTimes = 1;
//tradequantity *

fyers.setAppId("R3PYOUE8EO-100");

var accesstoken =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhcGkuZnllcnMuaW4iLCJpYXQiOjE3MTg2ODIwMTcsImV4cCI6MTcxODc1NzAxNywibmJmIjoxNzE4NjgyMDE3LCJhdWQiOlsieDowIiwieDoxIiwieDoyIiwiZDoxIiwiZDoyIiwieDoxIiwieDowIl0sInN1YiI6ImFjY2Vzc190b2tlbiIsImF0X2hhc2giOiJnQUFBQUFCbWNRR2hrYm9rUTVIdEpHbmwya256ODRQZzJWemFBamN3UmNoQi1yUzVGZXgtbWZxd19mWVNKcjdaOWlTMDRYR1VxU0N4LXFRa3BOTnZ5VWhJMHdBbEl3U3M4cHFaX05PWHYzUHR6QUxzSFBET0ZYYz0iLCJkaXNwbGF5X25hbWUiOiJNQU5PSiBJU0FBQyBHT0RXSU4iLCJvbXMiOiJLMSIsImhzbV9rZXkiOiJjOGMyMmYxMDE3YzFhNjJiNzZmMzY4ZGEzOTQ1NjliMGU1YmNiYmM0ZDI0MTBlNjFiYTE2YjllMSIsImZ5X2lkIjoiWE0yNzE4MyIsImFwcFR5cGUiOjEwMCwicG9hX2ZsYWciOiJOIn0.AA2kwCyBkoKkUvBwNlkdv0X_OcLxwgEhhMDMB_t0erg";

fyers.setAccessToken(accesstoken);
var sktorders = new fyersOrderSocket(accesstoken);
var skt = DataSocket.getInstance(accesstoken);

var orderDetails = {
    symbol: "NSE:RELIANCE", // Example symbol (Reliance)
    qty: 1,
    type: "LIMIT",
    side: "BUY",
    productType: "INTRADAY",
    limitPrice: 1000, // Example limit price
};

async function fetchBTCUSDTPrice() {
    try {
        const prices = await client.prices({ symbol: "BTCUSDT" });

        if (firstBTCPrice == 0) {
            firstBTCPrice = prices.BTCUSDT;
        }
        if (currentTrade == "BUY") {
            // if (intervalIdS != 0){
            //     clearInterval(intervalIdS);
            //     intervalIdS = 0;
            // }

            if (prices.BTCUSDT - firstBTCPrice > 1000) {
                console.log("Exit BUY Trade with profit");
                firstBTCPrice = 0;

                // const resultBUY = await client.futuresOrder({
                //   symbol: 'BTCUSDT',
                //   side: 'SELL',
                //   type: 'MARKET',
                //   quantity:  tradequantity * tradeTimes
                // });
                currentTrade = "";
                const resultBUY = await client
                    .futuresOrder({
                        symbol: "BTCUSDT",
                        side: "SELL",
                        type: "LIMIT",
                        quantity: tradequantity * tradeTimes,
                        price: Math.round(prices.BTCUSDT) - 60, // specify your limit price here
                        timeInForce: "GTC", // Good Till Canceled (other options: 'IOC', 'FOK')
                    })
                    .then((_) => {
                        tradeTimes = 1;
                        clearInterval(intervalIdB);
                    });
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
            // if (intervalIdB != 0){
            //     clearInterval(intervalIdB);
            //     intervalIdB = 0;
            // }
            if (firstBTCPrice - prices.BTCUSDT > 1000) {
                console.log("Exit SELL Trade with profit");
                firstBTCPrice = 0;
                // const resultSELL = await client.futuresOrder({
                //   symbol: 'BTCUSDT',
                //   side: 'BUY',
                //   type: 'MARKET',
                //   quantity:  tradequantity * tradeTimes
                // });
                currentTrade = "";
                const resultSELL = await client
                    .futuresOrder({
                        symbol: "BTCUSDT",
                        side: "BUY",
                        type: "LIMIT",
                        quantity: tradequantity * tradeTimes,
                        price: Math.round(prices.BTCUSDT) + 60, // specify your limit price here
                        timeInForce: "GTC", // Good Till Canceled (other options: 'IOC', 'FOK')
                    })
                    .then((_) => {
                        tradeTimes = 1;
                        clearInterval(intervalIdS);
                    });
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

skt.on("connect", function () {
    skt.mode(skt.LiteMode);
    console.log("skt connected");
    // Function to fetch and display BTC/USDT price
});

// Define a route handler for handling POST requests
app.post("/submit-form", async (req, res) => {
    const pricesPost = await client.prices({ symbol: "BTCUSDT" });
    //console.log(await client.ping())
    //console.log(await client.futuresPing())
    //console.log(await client.exchangeInfo())
    // Extract data from the request body
    const formData = req.body;
    console.log("Received: ", formData);
    let inputString = String(formData);
    console.log(
        "command:",
        inputString.split(" ")[0],
        "/",
        " value :",
        inputString.slice(-8)
    );
    switch (inputString.split(" ")[0]) {
        case "BUY":
            if (currentTrade == "") {
                currentTrade = "BUY";
                tradeTimes = 1;
                const resultBUYFirst = await client.futuresOrder({
                    symbol: "BTCUSDT",
                    side: "BUY",
                    type: "LIMIT",
                    quantity: tradequantity * tradeTimes,
                    price: Math.round(parseFloat(inputString.slice(-8))) + 60, // specify your limit price here
                    timeInForce: "GTC", // Good Till Canceled (other options: 'IOC', 'FOK')
                });
            } else {
                clearInterval(intervalIdS);
                firstBTCPrice = 0;
                tradeTimes = 2;
                const resultBUY = await client.futuresOrder({
                    symbol: "BTCUSDT",
                    side: "BUY",
                    type: "LIMIT",
                    quantity: tradequantity * tradeTimes,
                    price: Math.round(parseFloat(inputString.slice(-8))) + 60, // specify your limit price here
                    timeInForce: "GTC", // Good Till Canceled (other options: 'IOC', 'FOK')
                });
            }
            // Set up a timer to fetch the price every second (1000 milliseconds)
            intervalIdB = setInterval(fetchBTCUSDTPrice, 1000);
            currentTrade = "BUY";
            break;
        case "SELL":
            try {
                const symbol = "BTCUSDT";
                // Get market price of the symbol
                await getTickerPrice(symbol);

                if (currentTrade == "") {
                    currentTrade = "SELL";
                    tradeTimes = 1;
                    const resultSELLFirst = await client.futuresOrder({
                        symbol: "BTCUSDT",
                        side: "SELL",
                        type: "LIMIT",
                        quantity: tradequantity * tradeTimes,
                        price: Math.round(parseFloat(inputString.slice(-8))) - 60, // specify your limit price here
                        timeInForce: "GTC", // Good Till Canceled (other options: 'IOC', 'FOK')
                    });
                } else {
                    clearInterval(intervalIdB);
                    firstBTCPrice = 0;
                    tradeTimes = 2;
                    const resultSELL = await client.futuresOrder({
                        symbol: "BTCUSDT",
                        side: "SELL",
                        type: "LIMIT",
                        quantity: tradequantity * tradeTimes,
                        price: Math.round(parseFloat(inputString.slice(-8))) - 60, // specify your limit price here
                        timeInForce: "GTC", // Good Till Canceled (other options: 'IOC', 'FOK')
                    });
                }
                currentTrade = "SELL";
                // Set up a timer to fetch the price every second (1000 milliseconds)
                intervalIdS = setInterval(fetchBTCUSDTPrice, 1000);
            } catch (error) {
                console.error("Error Making trade:", error);
            }
            break;
        case "BUYNIFTY":
            if (NiftyPE != "") {
                //holds the symbol and not started
                LNiftyPE = NiftyPE; //save the symbol for switch trade
            }
            NiftyCE =
                GenericTagCEPE +
                ((Math.round(parseFloat(inputString.slice(-8))) % 50) * 50) +
                "CE"; //  what trade needs to be switched
            break;
        case "SELLNIFTY":
            if (NiftyCE != "") {
                //holds the symbol and not started
                LNiftyCE = NiftyCE; //save the symbol for switch trade
            }
            NiftyPE =
                GenericTagCEPE +
                ((Math.round(parseFloat(inputString.slice(-8))) % 50) * 50) +
                "PE"; //  what trade needs to be switched
            break;
        case "BUYBNIFTY":
            if (BNiftyPE != "") {
                //holds the symbol and not started
                LBNiftyPE = BNiftyPE; //save the symbol for switch trade
            }
            BNiftyCE =
                BGenericTagCEPE +
                ((Math.round(parseFloat(inputString.slice(-8))) % 100) * 100) +
                "CE"; //  what trade needs to be switched
            break;
        case "SELLBNIFTY":
            if (BNiftyCE != "") {
                //holds the symbol and not started
                LBNiftyCE = BNiftyCE; //save the symbol for switch trade
            }
            BNiftyPE =
                BGenericTagCEPE +
                ((Math.round(parseFloat(inputString.slice(-8))) % 100) * 100) +
                "PE"; //  what trade needs to be switched
            break;
    }

    // Process the form data (here, just sending it back as a response)
    res.json({ message: "Form submitted successfully", formData });
});

app.get("/", (req, res) => {
    // Extract data from the request body
    const formData = req.body;

    // Process the form data (here, just sending it back as a response)
    res.json({ message: "Form submitted successfully", formData });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

skt.on("message", function (message) {
    if (NiftyCE != "") {
        if (LNiftyPE != "") {
            //switch trade
            //exit profit or loss - switch trade
            switch (message.symbol) {
                case NiftyCE:
                    orderDetails = {
                        symbol: NiftyCE, // Example symbol (Reliance)
                        qty: 50 * Tradex,
                        type: "LIMIT",
                        side: "BUY",
                        productType: "INTRADAY",
                        limitPrice: message.ltp + 0.5, // Example limit price
                    };
                    sktorders
                        .placeOrder(orderDetails)
                        .then((response) => {
                            console.log("Order placed successfully:", response);
                            TNiftyCE = message.ltp + 0.5;
                            LNiftyPE = "";
                        })
                        .catch((error) => {
                            console.error("Error placing order:", error);
                        });

                    break;
                case NiftyPE:
                    orderDetails = {
                        symbol: NiftyPE, // Example symbol (Reliance)
                        qty: 50 * Tradex,
                        type: "LIMIT",
                        side: "SELL",
                        productType: "INTRADAY",
                        limitPrice: message.ltp - 0.5, // Example limit price
                    };
                    sktorders
                        .placeOrder(orderDetails)
                        .then((response) => {
                            console.log("Order placed successfully:", response);
                            subscribeList.pop(NiftyPE);
                            subscribeList.push(NiftyCE);
                            skt.subscribe(subscribeList);
                            NiftyPE = "";
                        })
                        .catch((error) => {
                            console.error("Error placing order:", error);
                        });
                    break;
            }
        } else {
            //First Trade or check profit
            if (TNiftyCE == 0) {
                orderDetails = {
                    symbol: NiftyCE, // Example symbol (Reliance)
                    qty: 50 * Tradex,
                    type: "LIMIT",
                    side: "BUY",
                    productType: "INTRADAY",
                    limitPrice: message.ltp + 0.5, // Example limit price
                };
                sktorders
                    .placeOrder(orderDetails)
                    .then((response) => {
                        console.log("Order placed successfully:", response);
                        TNiftyCE = message.ltp + 0.5;
                    })
                    .catch((error) => {
                        console.error("Error placing order:", error);
                    });
            } else {
                //check for profit
                if (message.ltp > TNiftyCE * 1.1) {
                    orderDetails = {
                        symbol: NiftyCE, // Example symbol (Reliance)
                        qty: 50 * Tradex,
                        type: "LIMIT",
                        side: "BUY",
                        productType: "INTRADAY",
                        limitPrice: message.ltp + 0.5, // Example limit price
                    };
                    sktorders
                        .placeOrder(orderDetails)
                        .then((response) => {
                            console.log("Order placed successfully:", response);
                        })
                        .catch((error) => {
                            console.error("Error placing order:", error);
                        });
                    TNiftyCE = 0;
                    NiftyCE = '';
                }
            }
        }
    }
    if (NiftyPE != "") {
        if (LNiftyCE != "") {
            //switch trade
            //exit profit or loss - switch trade
            switch (message.symbol) {
                case NiftyPE:
                    orderDetails = {
                        symbol: NiftyPE, // Example symbol (Reliance)
                        qty: 50 * Tradex,
                        type: "LIMIT",
                        side: "BUY",
                        productType: "INTRADAY",
                        limitPrice: message.ltp + 0.5, // Example limit price
                    };
                    sktorders
                        .placeOrder(orderDetails)
                        .then((response) => {
                            console.log("Order placed successfully:", response);
                            TNiftyPE = message.ltp + 0.5;
                            LNiftyCE = "";
                        })
                        .catch((error) => {
                            console.error("Error placing order:", error);
                        });

                    break;
                case NiftyCE:
                    orderDetails = {
                        symbol: NiftyCE, // Example symbol (Reliance)
                        qty: 50 * Tradex,
                        type: "LIMIT",
                        side: "SELL",
                        productType: "INTRADAY",
                        limitPrice: message.ltp - 0.5, // Example limit price
                    };
                    sktorders
                        .placeOrder(orderDetails)
                        .then((response) => {
                            console.log("Order placed successfully:", response);
                            subscribeList.pop(NiftyCE);
                            subscribeList.push(NiftyPE);
                            skt.subscribe(subscribeList);
                            NiftyCE = "";
                        })
                        .catch((error) => {
                            console.error("Error placing order:", error);
                        });
                    break;
            }
        } else {
            //First Trade or check profit
            if (TNiftyPE == 0) {
                orderDetails = {
                    symbol: NiftyPE, // Example symbol (Reliance)
                    qty: 50 * Tradex,
                    type: "LIMIT",
                    side: "BUY",
                    productType: "INTRADAY",
                    limitPrice: message.ltp + 0.5, // Example limit price
                };
                sktorders
                    .placeOrder(orderDetails)
                    .then((response) => {
                        console.log("Order placed successfully:", response);
                        TNiftyPE = message.ltp + 0.5;
                    })
                    .catch((error) => {
                        console.error("Error placing order:", error);
                    });
            } else {
                //check for profit
                if (message.ltp > TNiftyPE * 1.1) {
                    orderDetails = {
                        symbol: NiftyPE, // Example symbol (Reliance)
                        qty: 50 * Tradex,
                        type: "LIMIT",
                        side: "BUY",
                        productType: "INTRADAY",
                        limitPrice: message.ltp + 0.5, // Example limit price
                    };
                    sktorders
                        .placeOrder(orderDetails)
                        .then((response) => {
                            console.log("Order placed successfully:", response);
                        })
                        .catch((error) => {
                            console.error("Error placing order:", error);
                        });
                    TNiftyPE = 0;
                    NiftyPE = '';
                }
            }
        }
    }
    if (BNiftyCE != "") {
        if (LBNiftyPE != "") {
            //switch trade
            //exit profit or loss - switch trade
            switch (message.symbol) {
                case BNiftyCE:
                    orderDetails = {
                        symbol: BNiftyCE, // Example symbol (Reliance)
                        qty: 15 * BTradex,
                        type: "LIMIT",
                        side: "BUY",
                        productType: "INTRADAY",
                        limitPrice: message.ltp + 0.5, // Example limit price
                    };
                    sktorders
                        .placeOrder(orderDetails)
                        .then((response) => {
                            console.log("Order placed successfully:", response);
                            TBNiftyCE = message.ltp + 0.5;
                            LBNiftyPE = "";
                        })
                        .catch((error) => {
                            console.error("Error placing order:", error);
                        });

                    break;
                case BNiftyPE:
                    orderDetails = {
                        symbol: BNiftyPE, // Example symbol (Reliance)
                        qty: 15 * BTradex,
                        type: "LIMIT",
                        side: "SELL",
                        productType: "INTRADAY",
                        limitPrice: message.ltp - 0.5, // Example limit price
                    };
                    sktorders
                        .placeOrder(orderDetails)
                        .then((response) => {
                            console.log("Order placed successfully:", response);
                            subscribeList.pop(BNiftyPE);
                            subscribeList.push(BNiftyCE);
                            skt.subscribe(subscribeList);
                            BNiftyPE = "";
                        })
                        .catch((error) => {
                            console.error("Error placing order:", error);
                        });
                    break;
            }
        } else {
            //First Trade or check profit
            if (TBNiftyCE == 0) {
                orderDetails = {
                    symbol: BNiftyCE, // Example symbol (Reliance)
                    qty: 15 * BTradex,
                    type: "LIMIT",
                    side: "BUY",
                    productType: "INTRADAY",
                    limitPrice: message.ltp + 0.5, // Example limit price
                };
                sktorders
                    .placeOrder(orderDetails)
                    .then((response) => {
                        console.log("Order placed successfully:", response);
                        TBNiftyCE = message.ltp + 0.5;
                    })
                    .catch((error) => {
                        console.error("Error placing order:", error);
                    });
            } else {
                //check for profit
                if (message.ltp > TBNiftyCE * 1.1) {
                    orderDetails = {
                        symbol: BNiftyCE, // Example symbol (Reliance)
                        qty: 15 * BTradex,
                        type: "LIMIT",
                        side: "BUY",
                        productType: "INTRADAY",
                        limitPrice: message.ltp + 0.5, // Example limit price
                    };
                    sktorders
                        .placeOrder(orderDetails)
                        .then((response) => {
                            console.log("Order placed successfully:", response);
                        })
                        .catch((error) => {
                            console.error("Error placing order:", error);
                        });
                    TBNiftyCE = 0;
                    BNiftyCE = '';
                }
            }
        }
    }
    if (BNiftyPE != "") {
        if (LBNiftyCE != "") {
            //switch trade
            //exit profit or loss - switch trade
            switch (message.symbol) {
                case BNiftyPE:
                    orderDetails = {
                        symbol: BNiftyPE, // Example symbol (Reliance)
                        qty: 15 * BTradex,
                        type: "LIMIT",
                        side: "BUY",
                        productType: "INTRADAY",
                        limitPrice: message.ltp + 0.5, // Example limit price
                    };
                    sktorders
                        .placeOrder(orderDetails)
                        .then((response) => {
                            console.log("Order placed successfully:", response);
                            TBNiftyPE = message.ltp + 0.5;
                            LBNiftyCE = "";
                        })
                        .catch((error) => {
                            console.error("Error placing order:", error);
                        });

                    break;
                case BNiftyCE:
                    orderDetails = {
                        symbol: BNiftyCE, // Example symbol (Reliance)
                        qty: 15 * BTradex,
                        type: "LIMIT",
                        side: "SELL",
                        productType: "INTRADAY",
                        limitPrice: message.ltp - 0.5, // Example limit price
                    };
                    sktorders
                        .placeOrder(orderDetails)
                        .then((response) => {
                            console.log("Order placed successfully:", response);
                            subscribeList.pop(BNiftyCE);
                            subscribeList.push(BNiftyPE);
                            skt.subscribe(subscribeList);
                            BNiftyCE = "";
                        })
                        .catch((error) => {
                            console.error("Error placing order:", error);
                        });
                    break;
            }
        } else {
            //First Trade or check profit
            if (TBNiftyPE == 0) {
                orderDetails = {
                    symbol: BNiftyPE, // Example symbol (Reliance)
                    qty: 15 * BTradex,
                    type: "LIMIT",
                    side: "BUY",
                    productType: "INTRADAY",
                    limitPrice: message.ltp + 0.5, // Example limit price
                };
                sktorders
                    .placeOrder(orderDetails)
                    .then((response) => {
                        console.log("Order placed successfully:", response);
                        TBNiftyPE = message.ltp + 0.5;
                    })
                    .catch((error) => {
                        console.error("Error placing order:", error);
                    });
            } else {
                //check for profit
                if (message.ltp > TBNiftyPE * 1.1) {
                    orderDetails = {
                        symbol: BNiftyPE, // Example symbol (Reliance)
                        qty: 15 * BTradex,
                        type: "LIMIT",
                        side: "BUY",
                        productType: "INTRADAY",
                        limitPrice: message.ltp + 0.5, // Example limit price
                    };
                    sktorders
                        .placeOrder(orderDetails)
                        .then((response) => {
                            console.log("Order placed successfully:", response);
                        })
                        .catch((error) => {
                            console.error("Error placing order:", error);
                        });
                    TBNiftyPE = 0;
                    BNiftyPE = '';
                }
            }
        }
    }
});
skt.connect();