const express = require("express");
const bodyParser = require("body-parser");
// var fyersModel = require("fyers-api-v3").fyersModel;
// let DataSocket = require("fyers-api-v3").fyersDataSocket;
// var fyersOrderSocket = require("fyers-api-v3").fyersOrderSocket;
const axios = require("axios");
const qs = require('querystring');
const apiKey = 'k8jfisczsz5bsbff';
const apiSecret = 'kpahn5pws8ccvsamxyuxeb0z2l0dwppb';
const requestToken = '3wlTdhM9X4lMw5932zjmi6ecvXT0rV2m';
let  accessToken = 'h5gSQzOu4WxnB3SwUDukMKWW6nOmKHBl';


const KiteConnect = require("kiteconnect").KiteConnect;
const KiteTicker = require("kiteconnect").KiteTicker;

const kite = new KiteConnect({ api_key: apiKey });

let instrumentArr= [];
const ticker = new KiteTicker({
    api_key: apiKey,
    access_token: accessToken
  });
  ticker.connect();

  ticker.on("ticks", onTicks);
  ticker.on("connect", subscribe);

  function subscribe() {
    const items = [738561]; // Replace with the instrument token of the symbol you want to subscribe to
    //ticker.subscribe(items);
    //ticker.setMode(ticker.modeFull, items);
  }
  

  

// const loginUrl = kite.getLoginURL();
// console.log("Login URL: ", loginUrl);
// /https://kite.zerodha.com/connect/login?api_key=k8jfisczsz5bsbff&v=3
function getProfile() {
    kite.getProfile()
      .then(profile => {
        console.log("Profile: ", profile);
      })
      .catch(err => {
        console.error("Error getting profile: ", err);
      });
  }

if(accessToken == ''){
    kite.generateSession(requestToken, apiSecret)
    .then(response => {
      console.log("Access Token: ", response.access_token);      
      kite.setAccessToken(response.access_token);
  
      // Now you can make API calls
      //getProfile();
    })
    .catch(err => {
      console.error("Error generating session: ", err);
    });

}else{
    kite.setAccessToken(accessToken);

}





// You need to visit this URL, login with your Zerodha credentials, and get the request token from the redirected URL.

// var fyers = new fyersModel({ "logs": "path where you want to save logs", "enableLogging": false })
// const Binance = require("binance-api-node").default;
// const apiKey =
//     "az28mFGG4ul5r112HSKIgisDgHV6CTq6AjuT5raFNVsko1ZGSjmBRB2sS4hDKgOX";
// const apiSecret =
//     "IYdTyi4jjyVDWF94KQ0ec9S9V7mykATX9PvazdAGkyqUOWMF5RyLxX4v6NPDaenh";

// const client = Binance({
//     apiKey: key,
//     apiSecret: secret,
//     beautifyResponses: true,
//   });

// Authenticated client, can make signed calls
// const client = Binance({
//     apiKey: apiKey,
//     apiSecret: apiSecret,
// });

// client.time().then((time) => console.log(`Server time: ${time}`));

// Base URL for Binance Futures API
const BASE_URL = "https://fapi.binance.com";

// Function to get market price of a symbol
// async function getTickerPrice(symbol) {
//     try {
//         const response = await axios.get(`${BASE_URL}/fapi/v1/ticker/price`, {
//             params: { symbol: symbol },
//         });
//         console.log(`Price of ${symbol}:`, response.data);
//     } catch (error) {
//         console.error(`Error fetching price for ${symbol}:`, error);
//     }
// }

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

let SNiftyCE = 0;
let SNiftyPE = 0;
let SBNiftyCE = 0;
let SBNiftyPE = 0;

let Btradeside = "";
let BtradeDirection = "";
let BTagsReceivedState = false;
let Btradevalue = 0;
let BCurrentTrade = "";
let BTradeLossper = 0;
let BAbsoluteLoss = 0;
let Tradex = 1;
let BTradex = 1;
let minqnty = 25;
let Bminqnty = 15;
let BLastCEValue = 0;
let BLastPEValue = 0;
let firstBTCPrice = 0;
let currentTrade = "";
let intervalIdB = 0;
let intervalIdS = 0;
let tradequantity = 0.02;
let tradeTimes = 1;
//tradequantity *

// fyers.setAppId("R3PYOUE8EO-100");

// var accesstoken =
//     "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhcGkuZnllcnMuaW4iLCJpYXQiOjE3MTg3NjgxODEsImV4cCI6MTcxODg0MzQyMSwibmJmIjoxNzE4NzY4MTgxLCJhdWQiOlsieDowIiwieDoxIiwieDoyIiwiZDoxIiwiZDoyIiwieDoxIiwieDowIl0sInN1YiI6ImFjY2Vzc190b2tlbiIsImF0X2hhc2giOiJnQUFBQUFCbWNsSTFEN2M3TllCS19RV29GRXA1SjE5Zm8xUE1zOFl5a19iNl9rOTBGMEtYWnIwOEpDWGJwRnRMWUhlZlRDVzlGX3RtaHZsSzM4S1liUWxPdG9EV0U5YnNGZjQxTktQUWpMQmZKRHpQYVNYaWlyWT0iLCJkaXNwbGF5X25hbWUiOiJNQU5PSiBJU0FBQyBHT0RXSU4iLCJvbXMiOiJLMSIsImhzbV9rZXkiOiJjOGMyMmYxMDE3YzFhNjJiNzZmMzY4ZGEzOTQ1NjliMGU1YmNiYmM0ZDI0MTBlNjFiYTE2YjllMSIsImZ5X2lkIjoiWE0yNzE4MyIsImFwcFR5cGUiOjEwMCwicG9hX2ZsYWciOiJOIn0.3KqzkIJenq_ITwvdw926Lz2viztqXrawkuY6TyDGSBc";

// fyers.setAccessToken(accesstoken);
// var sktorders = new fyersOrderSocket(accesstoken);
// var skt = DataSocket.getInstance(accesstoken);

var orderDetails = {
    symbol: "NSE:RELIANCE", // Example symbol (Reliance)
    qty: 1,
    type: "LIMIT",
    side: "BUY",
    productType: "INTRADAY",
    limitPrice: 1000, // Example limit price
};

// async function fetchBTCUSDTPrice() {
//     try {
//         const prices = await client.prices({ symbol: "BTCUSDT" });

//         if (firstBTCPrice == 0) {
//             firstBTCPrice = prices.BTCUSDT;
//         }
//         if (currentTrade == "BUY") {
//             if (prices.BTCUSDT - firstBTCPrice > 1000) {
//                 console.log("Exit BUY Trade with profit");
//                 firstBTCPrice = 0;
//                 // const resultBUY = await client
//                 //     .futuresOrder({
//                 //         symbol: "BTCUSDT",
//                 //         side: "SELL",
//                 //         type: "LIMIT",
//                 //         quantity: tradequantity * tradeTimes,
//                 //         price: Math.round(prices.BTCUSDT) - 60, // specify your limit price here
//                 //         timeInForce: "GTC", // Good Till Canceled (other options: 'IOC', 'FOK')
//                 //     })
//                 //     .then((_) => {
//                 //         tradeTimes = 1;
//                 //         clearInterval(intervalIdB);
//                 //     });

//                 //remove
//                 clearInterval(intervalIdB);
//                 console.log( currentTrade + ' / ' + Math.round(prices.BTCUSDT));
//                 currentTrade = "";
//             } else {
//                 console.log(
//                     `The current price of BTC/USDT is: ${Number(prices.BTCUSDT).toFixed(
//                         2
//                     )}`,
//                     `BUY Profit is : ${Number(prices.BTCUSDT - firstBTCPrice).toFixed(2)}`
//                 );
//             }
//         }

//         if (currentTrade == "SELL") {
//             if (firstBTCPrice - prices.BTCUSDT > 1000) {
//                 console.log("Exit SELL Trade with profit");
//                 firstBTCPrice = 0;
//                 // const resultSELL = await client
//                 //     .futuresOrder({
//                 //         symbol: "BTCUSDT",
//                 //         side: "BUY",
//                 //         type: "LIMIT",
//                 //         quantity: tradequantity * tradeTimes,
//                 //         price: Math.round(prices.BTCUSDT) + 60, // specify your limit price here
//                 //         timeInForce: "GTC", // Good Till Canceled (other options: 'IOC', 'FOK')
//                 //     })
//                 //     .then((_) => {
//                 //         tradeTimes = 1;
//                 //         clearInterval(intervalIdS);
//                 //     });
//                 //remove
//                 clearInterval(intervalIdS);
//                 console.log( currentTrade + ' / ' + Math.round(prices.BTCUSDT));
//                 currentTrade = "";
//             } else {
//                 console.log(
//                     `The current price of BTC/USDT is: ${Number(prices.BTCUSDT).toFixed(
//                         2
//                     )}`,
//                     `SELL Profit is : ${Number(firstBTCPrice - prices.BTCUSDT).toFixed(
//                         2
//                     )}`
//                 );
//             }
//         }
//     } catch (error) {
//         console.error("Error fetching BTC/USDT price:", error);
//     }
// }

// skt.on("connect", function () {
//     skt.mode(skt.LiteMode);
//     console.log("skt connected");
//     // Function to fetch and display BTC/USDT price
// });

function placeLimitOrder(exchange, tradingsymbol, quantity, price, transactionType) {
    if (transactionType === kite.TRANSACTION_TYPE_BUY){
        const orderParams = {
            exchange: exchange,
            tradingsymbol: tradingsymbol,
            transaction_type: kite.TRANSACTION_TYPE_BUY, // or kite.TRANSACTION_TYPE_SELL
            quantity: quantity,
            price: price + 0.5,
            order_type: kite.ORDER_TYPE_LIMIT,
            product: kite.PRODUCT_MIS, // or kite.PRODUCT_MIS for intraday
            validity: kite.VALIDITY_DAY
          };
    }else{
        const orderParams = {
            exchange: exchange,
            tradingsymbol: tradingsymbol,
            transaction_type: kite.TRANSACTION_TYPE_SELL, // or kite.TRANSACTION_TYPE_SELL
            quantity: quantity,
            price: price,
            order_type: kite.ORDER_TYPE_LIMIT,
            product: kite.PRODUCT_MIS, // or kite.PRODUCT_MIS for intraday
            validity: kite.VALIDITY_DAY
          };
    }  
    kite.placeOrder(kite.VARIETY_REGULAR, orderParams)
      .then(order => {
        console.log("Order placed successfully. Order ID: ", order.order_id);
      })
      .catch(err => {
        console.error("Error placing order: ", err);
      });
  }

  function onTicks(ticks) {
    console.log("Ticks: ", ticks);
    ticks.forEach(tick => {
      console.log(`LTP for ${tick.instrument_token}: ${tick.last_price}`);

        if (NiftyCE != "") {
            if (LNiftyPE != "") {
                //switch trade
                //exit profit or loss - switch trade
                switch (tick.instrument_token) {
                    case NiftyCE:
                        TNiftyCE = tick.last_price + 0.5;
                        placeLimitOrder('NFO', tick.instrument_token, minqnty * Tradex, TNiftyCE, kite.TRANSACTION_TYPE_BUY);
                        LNiftyPE = "";                
                        break;
                    case NiftyPE:
                        SNiftyPE = tick.last_price - 0.5;
                        placeLimitOrder('NFO', tick.instrument_token, minqnty * Tradex, SNiftyPE, kite.TRANSACTION_TYPE_SELL);                
                        instrumentArr.pop(NiftyPE);
                        instrumentArr.push(NiftyCE);
                        ticker.subscribe(instrumentArr);
                        ticker.setMode(ticker.modeLTP, instrumentArr);
                        NiftyPE = "";
                        break;
                }
            } else{
                if (TNiftyCE == 0) {
                    TNiftyCE = tick.last_price + 0.5;
                    placeLimitOrder('NFO', tick.instrument_token, minqnty * Tradex, TNiftyCE, kite.TRANSACTION_TYPE_BUY);                
                }else{
                    if (tick.last_price > TNiftyCE * 1.1) {
                        SNiftyCE = tick.last_price - 0.5;
                        placeLimitOrder('NFO', tick.instrument_token, minqnty * Tradex, SNiftyCE, kite.TRANSACTION_TYPE_SELL);                
                    }
                }
            }
        }
        if (NiftyPE != "") {
            if (LNiftyCE != "") {
                //switch trade
                //exit profit or loss - switch trade
                switch (tick.instrument_token) {
                    case NiftyPE:
                        TNiftyPE = tick.last_price + 0.5;
                        placeLimitOrder('NFO', tick.instrument_token, minqnty * Tradex, TNiftyPE, kite.TRANSACTION_TYPE_BUY);
                        LNiftyCE = "";                
                        break;
                    case NiftyCE:
                        SNiftyCE = tick.last_price - 0.5;
                        placeLimitOrder('NFO', tick.instrument_token, minqnty * Tradex, SNiftyCE, kite.TRANSACTION_TYPE_SELL);                
                        instrumentArr.pop(NiftyCE);
                        instrumentArr.push(NiftyPE);
                        ticker.subscribe(instrumentArr);
                        ticker.setMode(ticker.modeLTP, instrumentArr);
                        NiftyCE = "";
                        break;
                }
            } else{
                if (TNiftyPE == 0) {
                    TNiftyPE = tick.last_price + 0.5;
                    placeLimitOrder('NFO', tick.instrument_token, minqnty * Tradex, TNiftyPE, kite.TRANSACTION_TYPE_BUY);                
                }else{
                    if (tick.last_price > TNiftyPE * 1.1) {
                        SNiftyPE = tick.last_price - 0.5;
                        placeLimitOrder('NFO', tick.instrument_token, minqnty * Tradex, SNiftyPE, kite.TRANSACTION_TYPE_SELL);                
                    }
                }
            }
        }

        if (BNiftyCE != "") {
            if (LBNiftyPE != "") {
                //switch trade
                //exit profit or loss - switch trade
                switch (tick.instrument_token) {
                    case BNiftyCE:
                        TBNiftyCE = tick.last_price + 0.5;
                        placeLimitOrder('NFO', tick.instrument_token, minqnty * Tradex, TBNiftyCE, kite.TRANSACTION_TYPE_BUY);
                        LBNiftyPE = "";                
                        break;
                    case BNiftyPE:
                        SBNiftyPE = tick.last_price - 0.5;
                        placeLimitOrder('NFO', tick.instrument_token, minqnty * Tradex, SBNiftyPE, kite.TRANSACTION_TYPE_SELL);                
                        instrumentArr.pop(BNiftyPE);
                        instrumentArr.push(BNiftyCE);
                        ticker.subscribe(instrumentArr);
                        ticker.setMode(ticker.modeLTP, instrumentArr);
                        BNiftyPE = "";
                        break;
                }
            } else{
                if (TBNiftyCE == 0) {
                    TBNiftyCE = tick.last_price + 0.5;
                    placeLimitOrder('NFO', tick.instrument_token, minqnty * Tradex, TBNiftyCE, kite.TRANSACTION_TYPE_BUY);                
                }else{
                    if (tick.last_price > TBNiftyCE * 1.1) {
                        SBNiftyCE = tick.last_price - 0.5;
                        placeLimitOrder('NFO', tick.instrument_token, minqnty * Tradex, SBNiftyCE, kite.TRANSACTION_TYPE_SELL);                
                    }
                }
            }
        }
        if (BNiftyPE != "") {
            if (LBNiftyCE != "") {
                //switch trade
                //exit profit or loss - switch trade
                switch (tick.instrument_token) {
                    case BNiftyPE:
                        TBNiftyPE = tick.last_price + 0.5;
                        placeLimitOrder('NFO', tick.instrument_token, minqnty * Tradex, TBNiftyPE, kite.TRANSACTION_TYPE_BUY);
                        LBNiftyCE = "";                
                        break;
                    case BNiftyCE:
                        SBNiftyCE = tick.last_price - 0.5;
                        placeLimitOrder('NFO', tick.instrument_token, minqnty * Tradex, SBNiftyCE, kite.TRANSACTION_TYPE_SELL);                
                        instrumentArr.pop(BNiftyCE);
                        instrumentArr.push(BNiftyPE);
                        ticker.subscribe(instrumentArr);
                        ticker.setMode(ticker.modeLTP, instrumentArr);
                        BNiftyCE = "";
                        break;
                }
            } else{
                if (TBNiftyPE == 0) {
                    TBNiftyPE = tick.last_price + 0.5;
                    placeLimitOrder('NFO', tick.instrument_token, minqnty * Tradex, TBNiftyPE, kite.TRANSACTION_TYPE_BUY);                
                }else{
                    if (tick.last_price > TBNiftyPE * 1.1) {
                        SBNiftyPE = tick.last_price - 0.5;
                        placeLimitOrder('NFO', tick.instrument_token, minqnty * Tradex, SBNiftyPE, kite.TRANSACTION_TYPE_SELL);                
                    }
                }
            }
        }
    });
  }

  function addticker(symbol){
    kite.getInstruments("NFO").then(instruments => {
        // Find the specific Nifty option
        //const tradingsymbol = "NIFTY2462023500CE"; // Example symbol, replace with your desired symbol
        const instrument = instruments.find(inst => inst.tradingsymbol === symbol);
        
        if (instrument) {
          console.log(`Instrument token for ${symbol}: ${instrument.instrument_token}`);
          instrumentArr.push(instrument.instrument_token);
          ticker.subscribe(instrumentArr);
          ticker.setMode(ticker.modeLTP, instrumentArr);
        } else {
          console.error("Instrument not found");
        }
          // Now you can make API calls
          //getProfile();
      });
}
// Define a route handler for handling POST requests
app.post("/submit-form", async (req, res) => {
    //const pricesPost = await client.prices({ symbol: "BTCUSDT" });
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
        // case "BUY":
        //     if (currentTrade == "") {
        //         currentTrade = "BUY";
        //         tradeTimes = 1;
        //         // const resultBUYFirst = await client.futuresOrder({
        //         //     symbol: "BTCUSDT",
        //         //     side: "BUY",
        //         //     type: "LIMIT",
        //         //     quantity: tradequantity * tradeTimes,
        //         //     price: Math.round(parseFloat(inputString.slice(-8))) + 60, // specify your limit price here
        //         //     timeInForce: "GTC", // Good Till Canceled (other options: 'IOC', 'FOK')
        //         // });
        //         console.log( currentTrade + ' / ' + inputString.slice(-8));
        //     } else {
        //         clearInterval(intervalIdS);
        //         firstBTCPrice = 0;
        //         tradeTimes = 2;
        //         // const resultBUY = await client.futuresOrder({
        //         //     symbol: "BTCUSDT",
        //         //     side: "BUY",
        //         //     type: "LIMIT",
        //         //     quantity: tradequantity * tradeTimes,
        //         //     price: Math.round(parseFloat(inputString.slice(-8))) + 60, // specify your limit price here
        //         //     timeInForce: "GTC", // Good Till Canceled (other options: 'IOC', 'FOK')
        //         // });
        //         console.log( currentTrade + ' / ' + inputString.slice(-8));
        //     }
        //     // Set up a timer to fetch the price every second (1000 milliseconds)
        //     intervalIdB = setInterval(fetchBTCUSDTPrice, 1000);
        //     currentTrade = "BUY";
        //     break;
        // case "SELL":
        //     try {
        //         const symbol = "BTCUSDT";
        //         // Get market price of the symbol
        //         await getTickerPrice(symbol);

        //         if (currentTrade == "") {
        //             currentTrade = "SELL";
        //             tradeTimes = 1;
        //             // const resultSELLFirst = await client.futuresOrder({
        //             //     symbol: "BTCUSDT",
        //             //     side: "SELL",
        //             //     type: "LIMIT",
        //             //     quantity: tradequantity * tradeTimes,
        //             //     price: Math.round(parseFloat(inputString.slice(-8))) - 60, // specify your limit price here
        //             //     timeInForce: "GTC", // Good Till Canceled (other options: 'IOC', 'FOK')
        //             // });
        //             console.log( currentTrade + ' / ' + inputString.slice(-8));
        //         } else {
        //             clearInterval(intervalIdB);
        //             firstBTCPrice = 0;
        //             tradeTimes = 2;
        //             // const resultSELL = await client.futuresOrder({
        //             //     symbol: "BTCUSDT",
        //             //     side: "SELL",
        //             //     type: "LIMIT",
        //             //     quantity: tradequantity * tradeTimes,
        //             //     price: Math.round(parseFloat(inputString.slice(-8))) - 60, // specify your limit price here
        //             //     timeInForce: "GTC", // Good Till Canceled (other options: 'IOC', 'FOK')
        //             // });
        //             console.log( currentTrade + ' / ' + inputString.slice(-8));
        //         }
        //         currentTrade = "SELL";
        //         // Set up a timer to fetch the price every second (1000 milliseconds)
        //         intervalIdS = setInterval(fetchBTCUSDTPrice, 1000);
        //     } catch (error) {
        //         console.error("Error Making trade:", error);
        //     }
        //     break;
        case "BUYNIFTY":
            if (NiftyPE != "") {
                //holds the symbol and not started
                LNiftyPE = NiftyPE; //save the symbol for switch trade
                NiftyCE =
                GenericTagCEPE +
                (parseInt(inputString.slice(-8)) - (parseInt(inputString.slice(-8)) % 50)) +
                "CE"; //  what trade needs to be switched
            }else{
                NiftyCE =
                GenericTagCEPE +
                (parseInt(inputString.slice(-8)) - (parseInt(inputString.slice(-8)) % 50)) +
                "CE"; //  what trade needs to be switched
            addticker(NiftyCE);
            //subscribeList.push(NiftyCE);
            //skt.subscribe(subscribeList);            
            //console.log('311', NiftyCE, Number(inputString.slice(-8)));
            }

            break;
        case "SELLNIFTY":
            if (NiftyCE != "") {
                //holds the symbol and not started
                LNiftyCE = NiftyCE; //save the symbol for switch trade
                NiftyPE =
                GenericTagCEPE +
                (parseFloat(inputString.slice(-8)) - (parseFloat(inputString.slice(-8)) % 50)) +
                "PE"; //  what trade needs to be switched
            }else{
                NiftyPE =
                GenericTagCEPE +
                (parseFloat(inputString.slice(-8)) - (parseFloat(inputString.slice(-8)) % 50)) +
                "PE"; //  what trade needs to be switched
                addticker(NiftyPE);
            // subscribeList.push(NiftyPE);
            // skt.subscribe(subscribeList);  
            }

            break;
        case "BUYBNIFTY":
            if (BNiftyPE != "") {
                //holds the symbol and not started
                LBNiftyPE = BNiftyPE; //save the symbol for switch trade
                BNiftyCE =
                BGenericTagCEPE +
                (parseFloat(inputString.slice(-8)) - (parseFloat(inputString.slice(-8)) % 100)) +
                "CE"; //  what trade needs to be switched
            }else{
                BNiftyCE =
                BGenericTagCEPE +
                (parseFloat(inputString.slice(-8)) - (parseFloat(inputString.slice(-8)) % 100)) +
                "CE"; //  what trade needs to be switched
                addticker(BNiftyCE);
                // subscribeList.push(BNiftyCE);
                // skt.subscribe(subscribeList); 
            }
 
            break;
        case "SELLBNIFTY":
            if (BNiftyCE != "") {
                //holds the symbol and not started
                LBNiftyCE = BNiftyCE; //save the symbol for switch trade
                BNiftyPE =
                BGenericTagCEPE +
                (parseFloat(inputString.slice(-8)) - (parseFloat(inputString.slice(-8)) % 100)) +
                "PE"; //  what trade needs to be switched
            }else{
                BNiftyPE =
                BGenericTagCEPE +
                (parseFloat(inputString.slice(-8)) - (parseFloat(inputString.slice(-8)) % 100)) +
                "PE"; //  what trade needs to be switched
                addticker(BNiftyPE);
                // subscribeList.push(BNiftyPE);
                // skt.subscribe(subscribeList); 
            }

            break;
    }

    // Process the form data (here, just sending it back as a response)
    res.json({ message: "Form submitted successfully", formData });
});

// app.get("/", (req, res) => {
//     // Extract data from the request body
//     const formData = req.body;

//     // Process the form data (here, just sending it back as a response)
//     res.json({ message: "Form submitted successfully", formData });
// });

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// skt.on("message", function (message) {
    
//     if (NiftyCE != "") {
//         if (LNiftyPE != "") {
//             //switch trade
//             //exit profit or loss - switch trade
//             switch (message.symbol) {
//                 case NiftyCE:
//                     const reqBodyCES = {
//                         "symbol": NiftyCE,
//                         "qty": (minqnty * Tradex),
//                         "type": 1,
//                         "side": 1,
//                         "productType": "INTRADAY",
//                         "limitPrice": message.ltp + 0.5,
//                         "stopPrice": 0,
//                         "disclosedQty": 0,
//                         "validity": "DAY",
//                         "offlineOrder": false,
//                         "stopLoss": 0,
//                         "takeProfit": 0,
//                         "orderTag": "tag1"
//                     };
//                     fyers.place_order(reqBodyCES).then((response) => {
//                         console.log("Order placed successfully:", response);
//                         TNiftyCE = message.ltp + 0.5;
//                     }).catch((error) => {
//                             console.error("Error placing order:", error);
//                     });
//                     LNiftyPE = "";
//                     break;
//                 case NiftyPE:
//                     const reqBodyPES = {
//                         "symbol": NiftyPE,
//                         "qty": (minqnty * Tradex),
//                         "type": 1,
//                         "side": -1,
//                         "productType": "INTRADAY",
//                         "limitPrice": message.ltp - 0.5,
//                         "stopPrice": 0,
//                         "disclosedQty": 0,
//                         "validity": "DAY",
//                         "offlineOrder": false,
//                         "stopLoss": 0,
//                         "takeProfit": 0,
//                         "orderTag": "tag1"
//                     };
//                     fyers.place_order(reqBodyPES).then((response) => {
//                         console.log("Order placed successfully:", response);

//                     }).catch((error) => {
//                             console.error("Error placing order:", error);
//                     });
//                     subscribeList.pop(NiftyPE);
//                     subscribeList.push(NiftyCE);
//                     skt.subscribe(subscribeList);
//                     NiftyPE = "";
//                     break;
//             }
//         } else {
//             //First Trade or check profit
//             //console.log(NiftyCE, LNiftyPE, '/', TNiftyCE, message.ltp + 0.5);
//             if (TNiftyCE == 0 && message.ltp !== undefined ) {
//                 const reqBodyCE = {
//                     "symbol": NiftyCE,
//                     "qty": (minqnty * Tradex),
//                     "type": 1,
//                     "side": 1,
//                     "productType": "INTRADAY",
//                     "limitPrice": message.ltp + 0.5,
//                     "stopPrice": 0,
//                     "disclosedQty": 0,
//                     "validity": "DAY",
//                     "offlineOrder": false,
//                     "stopLoss": 0,
//                     "takeProfit": 0,
//                     "orderTag": "tag1"
//                 };
//                 fyers.place_order(reqBodyCE).then((response) => {
//                     console.log("Order placed successfully:", response);
//                     TNiftyCE = message.ltp + 0.5;
//                 }).catch((error) => {
//                         console.error("Error placing order:", error);
//                 });

//             } else {

//                 //check for profit
//                 if (message.ltp > TNiftyCE * 1.1) {
//                     const reqBodyCEP = {    
//                         "symbol": NiftyCE,
//                         "qty": (minqnty * Tradex),
//                         "type": 1,
//                         "side": -1,
//                         "productType": "INTRADAY",
//                         "limitPrice": message.ltp - 0.5,
//                         "stopPrice": 0,
//                         "disclosedQty": 0,
//                         "validity": "DAY",
//                         "offlineOrder": false,
//                         "stopLoss": 0,
//                         "takeProfit": 0,
//                         "orderTag": "tag1"
//                     };

//                     fyers.place_order(reqBodyCEP).then((response) => {
//                         console.log("Order placed successfully:", response);
//                         //TNiftyCE = message.ltp + 0.5;
//                     }).catch((error) => {
//                             console.error("Error placing order:", error);
//                     });
//                     TNiftyCE = 0;
//                     NiftyCE = '';
//                 }
//             }
//         }
//     }
//     if (NiftyPE != "") {
//         if (LNiftyCE != "") {
//             //switch trade
//             //exit profit or loss - switch trade
//             switch (message.symbol) {
//                 case NiftyPE:
//                         const reqBodyPES = {
//                             "symbol": NiftyPE,
//                             "qty": (minqnty * Tradex),
//                             "type": 1,
//                             "side": 1,
//                             "productType": "INTRADAY",
//                             "limitPrice": message.ltp + 0.5,
//                             "stopPrice": 0,
//                             "disclosedQty": 0,
//                             "validity": "DAY",
//                             "offlineOrder": false,
//                             "stopLoss": 0,
//                             "takeProfit": 0,
//                             "orderTag": "tag1"
//                         };
//                         fyers.place_order(reqBodyPES).then((response) => {
//                             console.log("Order placed successfully:", response);
//                             TNiftyPE = message.ltp + 0.5;
//                         }).catch((error) => {
//                                 console.error("Error placing order:", error);
//                         });
//                         LNiftyCE = "";

//                     break;

//                 case NiftyCE:
//                    const reqBodyCES = {
//                             "symbol": NiftyCE,
//                             "qty": (minqnty * Tradex),
//                             "type": 1,
//                             "side": -1,
//                             "productType": "INTRADAY",
//                             "limitPrice": message.ltp - 0.5,
//                             "stopPrice": 0,
//                             "disclosedQty": 0,
//                             "validity": "DAY",
//                             "offlineOrder": false,
//                             "stopLoss": 0,
//                             "takeProfit": 0,
//                             "orderTag": "tag1"
//                         };
//                         fyers.place_order(reqBodyCES).then((response) => {
//                             console.log("Order placed successfully:", response);
 
//                         }).catch((error) => {
//                                 console.error("Error placing order:", error);
//                         });
//                         subscribeList.pop(NiftyCE);
//                         subscribeList.push(NiftyPE);
//                         skt.subscribe(subscribeList);
//                         NiftyCE = "";
//                     break;
//             }
//         } else {
//             //First Trade or check profit
//             if (TNiftyPE == 0  && message.ltp !== undefined  ) {
//             const reqBodyPE = {
//                     "symbol": NiftyPE,
//                     "qty": (minqnty * Tradex),
//                     "type": 1,
//                     "side": 1,
//                     "productType": "INTRADAY",
//                     "limitPrice": message.ltp + 0.5,
//                     "stopPrice": 0,
//                     "disclosedQty": 0,
//                     "validity": "DAY",
//                     "offlineOrder": false,
//                     "stopLoss": 0,
//                     "takeProfit": 0,
//                     "orderTag": "tag1"
//                 };
//                 fyers.place_order(reqBodyPE).then((response) => {
//                     console.log("Order placed successfully:", response);
//                     TNiftyPE = message.ltp + 0.5;
//                 }).catch((error) => {
//                         console.error("Error placing order:", error);
//                 });
//             } else {
//                 //check for profit
//                 if (message.ltp > TNiftyPE * 1.1) {
//                     const reqBodyPEP = {    
//                         "symbol": NiftyPE,
//                         "qty": (minqnty * Tradex),
//                         "type": 1,
//                         "side": -1,
//                         "productType": "INTRADAY",
//                         "limitPrice": message.ltp - 0.5,
//                         "stopPrice": 0,
//                         "disclosedQty": 0,
//                         "validity": "DAY",
//                         "offlineOrder": false,
//                         "stopLoss": 0,
//                         "takeProfit": 0,
//                         "orderTag": "tag1"
//                     };

//                     fyers.place_order(reqBodyPEP).then((response) => {
//                         console.log("Order placed successfully:", response);
//                     }).catch((error) => {
//                             console.error("Error placing order:", error);
//                     });
//                     TNiftyPE = 0;
//                     NiftyPE = '';
//                 }
//             }
//         }
//     }
    
    // if (BNiftyCE != "") {
    //     if (LBNiftyPE != "") {
    //         //switch trade
    //         //exit profit or loss - switch trade
    //         switch (message.symbol) {
    //             case BNiftyCE:
    //                 orderDetails = {
    //                     symbol: BNiftyCE, // Example symbol (Reliance)
    //                     qty:  Bminqnty * BTradex,
    //                     type: "LIMIT",
    //                     side: "BUY",
    //                     productType: "INTRADAY",
    //                     limitPrice: message.ltp + 0.5, // Example limit price
    //                 };
    //                 sktorders
    //                     .placeOrder(orderDetails)
    //                     .then((response) => {
    //                         console.log("Order placed successfully:", response);
    //                         TBNiftyCE = message.ltp + 0.5;
    //                         LBNiftyPE = "";
    //                     })
    //                     .catch((error) => {
    //                         console.error("Error placing order:", error);
    //                     });

    //                 break;
    //             case BNiftyPE:
    //                 orderDetails = {
    //                     symbol: BNiftyPE, // Example symbol (Reliance)
    //                     qty:  Bminqnty * BTradex,
    //                     type: "LIMIT",
    //                     side: "SELL",
    //                     productType: "INTRADAY",
    //                     limitPrice: message.ltp - 0.5, // Example limit price
    //                 };
    //                 sktorders
    //                     .placeOrder(orderDetails)
    //                     .then((response) => {
    //                         console.log("Order placed successfully:", response);
    //                         subscribeList.pop(BNiftyPE);
    //                         subscribeList.push(BNiftyCE);
    //                         skt.subscribe(subscribeList);
    //                         BNiftyPE = "";
    //                     })
    //                     .catch((error) => {
    //                         console.error("Error placing order:", error);
    //                     });
    //                 break;
    //         }
    //     } else {
    //         //First Trade or check profit
    //         if (TBNiftyCE == 0) {
    //             orderDetails = {
    //                 symbol: BNiftyCE, // Example symbol (Reliance)
    //                 qty:  Bminqnty * BTradex,
    //                 type: "LIMIT",
    //                 side: "BUY",
    //                 productType: "INTRADAY",
    //                 limitPrice: message.ltp + 0.5, // Example limit price
    //             };
    //             sktorders
    //                 .placeOrder(orderDetails)
    //                 .then((response) => {
    //                     console.log("Order placed successfully:", response);
    //                     TBNiftyCE = message.ltp + 0.5;
    //                 })
    //                 .catch((error) => {
    //                     console.error("Error placing order:", error);
    //                 });
    //         } else {
    //             //check for profit
    //             if (message.ltp > TBNiftyCE * 1.1) {
    //                 orderDetails = {
    //                     symbol: BNiftyCE, // Example symbol (Reliance)
    //                     qty:  Bminqnty * BTradex,
    //                     type: "LIMIT",
    //                     side: "BUY",
    //                     productType: "INTRADAY",
    //                     limitPrice: message.ltp + 0.5, // Example limit price
    //                 };
    //                 sktorders
    //                     .placeOrder(orderDetails)
    //                     .then((response) => {
    //                         console.log("Order placed successfully:", response);
    //                     })
    //                     .catch((error) => {
    //                         console.error("Error placing order:", error);
    //                     });
    //                 TBNiftyCE = 0;
    //                 BNiftyCE = '';
    //             }
    //         }
    //     }
    // }
    // if (BNiftyPE != "") {
    //     if (LBNiftyCE != "") {
    //         //switch trade
    //         //exit profit or loss - switch trade
    //         switch (message.symbol) {
    //             case BNiftyPE:
    //                 orderDetails = {
    //                     symbol: BNiftyPE, // Example symbol (Reliance)
    //                     qty:  Bminqnty * BTradex,
    //                     type: "LIMIT",
    //                     side: "BUY",
    //                     productType: "INTRADAY",
    //                     limitPrice: message.ltp + 0.5, // Example limit price
    //                 };
    //                 sktorders
    //                     .placeOrder(orderDetails)
    //                     .then((response) => {
    //                         console.log("Order placed successfully:", response);
    //                         TBNiftyPE = message.ltp + 0.5;
    //                         LBNiftyCE = "";
    //                     })
    //                     .catch((error) => {
    //                         console.error("Error placing order:", error);
    //                     });

    //                 break;
    //             case BNiftyCE:
    //                 orderDetails = {
    //                     symbol: BNiftyCE, // Example symbol (Reliance)
    //                     qty:  Bminqnty * BTradex,
    //                     type: "LIMIT",
    //                     side: "SELL",
    //                     productType: "INTRADAY",
    //                     limitPrice: message.ltp - 0.5, // Example limit price
    //                 };
    //                 sktorders
    //                     .placeOrder(orderDetails)
    //                     .then((response) => {
    //                         console.log("Order placed successfully:", response);
    //                         subscribeList.pop(BNiftyCE);
    //                         subscribeList.push(BNiftyPE);
    //                         skt.subscribe(subscribeList);
    //                         BNiftyCE = "";
    //                     })
    //                     .catch((error) => {
    //                         console.error("Error placing order:", error);
    //                     });
    //                 break;
    //         }
    //     } else {
    //         //First Trade or check profit
    //         if (TBNiftyPE == 0) {
    //             orderDetails = {
    //                 symbol: BNiftyPE, // Example symbol (Reliance)
    //                 qty:  Bminqnty * BTradex,
    //                 type: "LIMIT",
    //                 side: "BUY",
    //                 productType: "INTRADAY",
    //                 limitPrice: message.ltp + 0.5, // Example limit price
    //             };
    //             sktorders
    //                 .placeOrder(orderDetails)
    //                 .then((response) => {
    //                     console.log("Order placed successfully:", response);
    //                     TBNiftyPE = message.ltp + 0.5;
    //                 })
    //                 .catch((error) => {
    //                     console.error("Error placing order:", error);
    //                 });
    //         } else {
    //             //check for profit
    //             if (message.ltp > TBNiftyPE * 1.1) {
    //                 orderDetails = {
    //                     symbol: BNiftyPE, // Example symbol (Reliance)
    //                     qty:  Bminqnty * BTradex,
    //                     type: "LIMIT",
    //                     side: "BUY",
    //                     productType: "INTRADAY",
    //                     limitPrice: message.ltp + 0.5, // Example limit price
    //                 };
    //                 sktorders
    //                     .placeOrder(orderDetails)
    //                     .then((response) => {
    //                         console.log("Order placed successfully:", response);
    //                     })
    //                     .catch((error) => {
    //                         console.error("Error placing order:", error);
    //                     });
    //                 TBNiftyPE = 0;
    //                 BNiftyPE = '';
    //             }
    //         }
    //     }
    // }
// });
// skt.autoreconnect(60);
// skt.connect();