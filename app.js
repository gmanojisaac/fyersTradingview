const express = require('express');
const bodyParser = require('body-parser');
//var fyersModel = require("fyers-api-v3").fyersModel;
//let DataSocket = require("fyers-api-v3").fyersDataSocket;
//var fyersOrderSocket = require("fyers-api-v3").fyersOrderSocket;
const axios = require('axios');
//var fyers = new fyersModel({ "logs": "path where you want to save logs", "enableLogging": false })
const Binance = require('binance-api-node').default;
const apiKey = 'az28mFGG4ul5r112HSKIgisDgHV6CTq6AjuT5raFNVsko1ZGSjmBRB2sS4hDKgOX';
const apiSecret = 'IYdTyi4jjyVDWF94KQ0ec9S9V7mykATX9PvazdAGkyqUOWMF5RyLxX4v6NPDaenh';

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

client.time().then(time => console.log(`Server time: ${time}`));

// Base URL for Binance Futures API
const BASE_URL = 'https://fapi.binance.com';

// Function to get market price of a symbol
async function getTickerPrice(symbol) {
    try {
      const response = await axios.get(`${BASE_URL}/fapi/v1/ticker/price`, {
        params: { symbol: symbol }
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
let BGenericTag = 'NSE:NIFTYBANK';
let BGenericTagCEPE = 'NSE:BANKNIFTY24306'
let BNiftyCE = 0;
let BNiftyPE = 0;
let Btradeside = '';
let BtradeDirection = '';
let BTagsReceivedState = false;
let Btradevalue = 0;
let BCurrentTrade = '';
let BTradeLossper = 0;
let BAbsoluteLoss = 0;
let BTradex = 1;
let BLastCEValue = 0;
let BLastPEValue = 0;
let firstBTCPrice = 0;
let currentTrade = '';
let intervalIdB = 0;
let intervalIdS = 0;
//fyers.setAppId("R3PYOUE8EO-100");

var accesstoken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhcGkuZnllcnMuaW4iLCJpYXQiOjE3MTg1OTAwMjcsImV4cCI6MTcxODY3MDYwNywibmJmIjoxNzE4NTkwMDI3LCJhdWQiOlsieDowIiwieDoxIiwieDoyIiwiZDoxIiwiZDoyIiwieDoxIiwieDowIl0sInN1YiI6ImFjY2Vzc190b2tlbiIsImF0X2hhc2giOiJnQUFBQUFCbWI1cExreFBLNW5lbGp6SHFZS1E0RUxFeFBfU2tHbFdxUmlVRTA3ZnhNcGJTM2RPMkp2eXltUjFSVGUxaU5EbG1HOXFGM2dfMDNzU0pWOTJieENhckZMWmtnVmtNUG1qTGZTckRfVXlKbVI4Y0lLOD0iLCJkaXNwbGF5X25hbWUiOiJNQU5PSiBJU0FBQyBHT0RXSU4iLCJvbXMiOiJLMSIsImhzbV9rZXkiOiJjOGMyMmYxMDE3YzFhNjJiNzZmMzY4ZGEzOTQ1NjliMGU1YmNiYmM0ZDI0MTBlNjFiYTE2YjllMSIsImZ5X2lkIjoiWE0yNzE4MyIsImFwcFR5cGUiOjEwMCwicG9hX2ZsYWciOiJOIn0.m3b-acDnID0N4Md6CswlquoZkSSnwzyAo0YDTw1Qgkc";


//fyers.setAccessToken(accesstoken);
//var sktorders = new fyersOrderSocket(accesstoken,);
//var skt = DataSocket.getInstance(accesstoken,)

var orderDetails = {
    symbol: 'NSE:RELIANCE',  // Example symbol (Reliance)
    qty: 1,
    type: 'LIMIT',
    side: 'BUY',
    productType: 'INTRADAY',
    limitPrice: 1000  // Example limit price
};

async function fetchBTCUSDTPrice() {
    try {
      const prices = await client.prices({ symbol: 'BTCUSDT' });
      
      if (firstBTCPrice == 0){
        firstBTCPrice = prices.BTCUSDT;
      }
      if(currentTrade == 'BUY'){
        // if (intervalIdS != 0){
        //     clearInterval(intervalIdS);
        //     intervalIdS = 0;
        // }
        
        if ((prices.BTCUSDT - firstBTCPrice) > 100){
            console.log('Exit BUY Trade with profit');
            firstBTCPrice = 0;
            clearInterval(intervalIdS);
            const resultBUY = await client.futuresOrder({
              symbol: 'BTCUSDT',
              side: 'SELL',
              type: 'MARKET',
              quantity:  0.002
            });
            currentTrade = '';
            
        } else{
            console.log(`The current price of BTC/USDT is: ${Number(prices.BTCUSDT).toFixed(2)}`, `BUY Profit is : ${Number(prices.BTCUSDT - firstBTCPrice).toFixed(2)}`);
        }
        
      }

      if (currentTrade == 'SELL'){
        // if (intervalIdB != 0){
        //     clearInterval(intervalIdB);
        //     intervalIdB = 0;
        // }
        if ((firstBTCPrice - prices.BTCUSDT) > 100){
            console.log('Exit SELL Trade with profit');
            firstBTCPrice = 0;

            clearInterval(intervalIdB);
            const resultSELL = await client.futuresOrder({
              symbol: 'BTCUSDT',
              side: 'BUY',
              type: 'MARKET',
              quantity:  0.002
            });
          currentTrade = '';
            
        } else{
            console.log(`The current price of BTC/USDT is: ${Number(prices.BTCUSDT).toFixed(2)}`, `SELL Profit is : ${Number(firstBTCPrice - prices.BTCUSDT).toFixed(2)}`);
        }
        
      }
      
    } catch (error) {
      console.error('Error fetching BTC/USDT price:', error);
    }
  }
  
// skt.on("connect", function () {

//     skt.mode(skt.LiteMode);
//     console.log('skt connected');
//     // Function to fetch and display BTC/USDT price 

// });



// Define a route handler for handling POST requests
app.post('/submit-form', async (req, res) => {

    //console.log(await client.ping())
    //console.log(await client.futuresPing())
    //console.log(await client.exchangeInfo())
    // Extract data from the request body
    const formData = req.body;
    console.log('Received: ', formData);
    let inputString = String(formData);
    console.log('command:', inputString.split(' ')[0], '/', ' value :', inputString.slice(-8));
    switch (inputString.split(' ')[0]){
        case 'BUY':
            if (currentTrade == ''){
              const resultBUYFirst = await client.futuresOrder({
                symbol: 'BTCUSDT',
                side: 'BUY',
                type: 'MARKET',
                quantity:  0.002
              });
            }else{
              clearInterval(intervalIdS);
              firstBTCPrice = 0;
              const resultBUY = await client.futuresOrder({
                symbol: 'BTCUSDT',
                side: 'BUY',
                type: 'MARKET',
                quantity:  0.004
              });
            }
            // Set up a timer to fetch the price every second (1000 milliseconds)
            intervalIdB = setInterval(fetchBTCUSDTPrice, 1000);
            currentTrade = 'BUY';
            break;
        case 'SELL':
            try{
            const symbol = 'BTCUSDT';
            // Get market price of the symbol
            await getTickerPrice(symbol);
            
            if (currentTrade == ''){
              const resultSELLFirst = await client.futuresOrder({
                symbol: 'BTCUSDT',
                side: 'SELL',
                type: 'MARKET',
                quantity:  0.002
              });
            }else{
              clearInterval(intervalIdB);
              firstBTCPrice = 0;
              const resultSELL = await client.futuresOrder({
                symbol: 'BTCUSDT',
                side: 'SELL',
                type: 'MARKET',
                quantity:  0.004
              });
            }
            currentTrade = 'SELL';
                // Set up a timer to fetch the price every second (1000 milliseconds)
            intervalIdS = setInterval(fetchBTCUSDTPrice, 1000);
        } catch (error) {
            console.error('Error Making trade:', error);
          }
            break;

    }
    // if (textreceived == 'TRADE') {
    //     subscribeList.pop(BNiftyPE);
    //     subscribeList.pop(BNiftyCE);
    //     BTagsReceivedState = false;
    //     if (BCurrentTrade == 'CE' && Btradevalue != 0) {
    //         BTradeLossper = BTradeLossper - (((Btradevalue - BLastCEValue) / Btradevalue) * 100);
    //         BAbsoluteLoss = BAbsoluteLoss - (((Btradevalue - BLastCEValue) / Btradevalue) * 100 * Math.pow(2, (BTradex + 1)));
    //         console.log('Exit CE Trade@', BLastCEValue - 0.5, ':', BTradeLossper);
    //         orderDetails = {
    //             symbol: BNiftyCE,  // Example symbol (Reliance)
    //             qty: (15 * BTradex),
    //             type: 'LIMIT',
    //             side: 'SELL',
    //             productType: 'INTRADAY',
    //             limitPrice: BLastCEValue - 0.5  // Example limit price
    //         };                        
    //         sktorders.placeOrder(orderDetails)
    //             .then(response => {
    //                 console.log('Order placed successfully:', response);
    //             })
    //             .catch(error => {
    //                 console.error('Error placing order:', error);
    //             });

    //         BCurrentTrade = '';
    //         Btradeside = '';
    //         Btradevalue = 0;
    //         BTradex = 0;
    //         BTradeLossper = 0;
    //         BAbsoluteLoss = 0;
    //     }
    //     if (BCurrentTrade == 'PE' && Btradevalue != 0) {
    //         BTradeLossper = BTradeLossper - (((Btradevalue - BLastPEValue) / Btradevalue) * 100);
    //         BAbsoluteLoss = BAbsoluteLoss - (((Btradevalue - BLastPEValue) / Btradevalue) * 100 * Math.pow(2, (BTradex + 1)));
    //         console.log('Exit PE Trade@', BLastPEValue - 0.5, ':', BTradeLossper);
    //         orderDetails = {
    //             symbol: BNiftyPE,  // Example symbol (Reliance)
    //             qty: (15 * BTradex),
    //             type: 'LIMIT',
    //             side: 'SELL',
    //             productType: 'INTRADAY',
    //             limitPrice: BLastPEValue - 0.5  // Example limit price
    //         };                        
    //         sktorders.placeOrder(orderDetails)
    //             .then(response => {
    //                 console.log('Order placed successfully:', response);
    //             })
    //             .catch(error => {
    //                 console.error('Error placing order:', error);
    //             });
    //         BCurrentTrade = '';
    //         Btradeside = '';
    //         Btradevalue = 0;
    //         BTradex = 0;
    //         BTradeLossper = 0;
    //         BAbsoluteLoss = 0;
    //     }

    //     textreceived = formData;
    //     textindex = textreceived.indexOf("is");
    //     higherindex = textreceived.slice(0, textindex);
    //     lowerindex = textreceived.slice(textindex + 2, textreceived.length);
    //     console.log('Higher / lower is ', higherindex, '/', lowerindex);
    //     textreceived = '';
    // } else {
    //     if (subscribeList.length != 0) { // Sprofit booked next data received
    //         subscribeList.pop(BNiftyPE);
    //         subscribeList.pop(BNiftyCE);
    //         BTagsReceivedState = false;
    //         skt.subscribe(subscribeList);
    //         textreceived = formData;
    //         textindex = textreceived.indexOf("is");
    //         higherindex = textreceived.slice(0, textindex);
    //         lowerindex = textreceived.slice(textindex + 2, textreceived.length);
    //         console.log('Higher / lower is ', higherindex, '/', lowerindex);
    //         textreceived = '';
    //         BCurrentTrade = '';
    //         Btradeside = '';
    //         Btradevalue = 0;
    //         BTradex = 0;
    //         BTradeLossper = 0;
    //         BAbsoluteLoss = 0;
    //     } else {//First Time
    //         subscribeList.push('NSE:NIFTYBANK-INDEX');
    //         skt.subscribe(subscribeList);
    //         textreceived = formData;
    //         textindex = textreceived.indexOf("is");
    //         higherindex = textreceived.slice(0, textindex);
    //         lowerindex = textreceived.slice(textindex + 2, textreceived.length);
    //         console.log('Higher / lower is ', higherindex, '/', lowerindex);
    //         textreceived = '';
    //     }

    // }

    // Process the form data (here, just sending it back as a response)
    res.json({ message: 'Form submitted successfully', formData });
});


app.get('/', (req, res) => {
    // Extract data from the request body
    const formData = req.body;

    // Process the form data (here, just sending it back as a response)
    res.json({ message: 'Form submitted successfully', formData });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// skt.on("message", function (message) {
//     //console.log('Reached here1',subscribeList, textreceived);

//     if (textreceived == 'WAITFORDATA') {
//         console.log('I am Waiting');
//     } else {
//         if (textreceived != '') {//Trade
//             //console.log('INTRADE');
//             switch (message.symbol) {
//                 case 'NSE:NIFTYBANK-INDEX':
//                     if (message.ltp > higherindex) {
//                         if (Btradeside == 'PE') {
//                             Btradeside = 'CE';
//                             BtradeDirection = 'BUY';
//                             console.log('Triggered CE @', message.ltp);
//                             textreceived = 'TRADE';
//                         }
//                     }

//                     if (message.ltp < lowerindex) {
//                         if (Btradeside == 'CE') {
//                             Btradeside = 'PE';
//                             BtradeDirection = 'BUY';
//                             console.log('Triggered PE @', message.ltp);
//                             textreceived = 'TRADE';
//                         }
//                     }
//                     //console.log('Checking Index @', message.ltp);                  
//                     break;

//                 case BNiftyCE:
//                     BLastCEValue = message.ltp;
//                     if (Btradeside == 'CE') {
//                         if (BCurrentTrade == '' && Btradevalue == 0) {
//                             if (BTradeLossper < -10) {
//                                 ++BTradex;
//                                 console.log('Take trade CE @', message.ltp, 'Capital : ', BTradex);
//                             } else {
//                                 console.log('Take trade CE @', message.ltp, 'Capital : ', BTradex);                                
//                             }
//                             orderDetails = {
//                                 symbol: BNiftyCE,  // Example symbol (Reliance)
//                                 qty: (15 * BTradex),
//                                 type: 'LIMIT',
//                                 side: 'BUY',
//                                 productType: 'INTRADAY',
//                                 limitPrice: message.ltp + 0.5  // Example limit price
//                             };                        
//                             sktorders.placeOrder(orderDetails)
//                                 .then(response => {
//                                     console.log('Order placed successfully:', response);
//                                 })
//                                 .catch(error => {
//                                     console.error('Error placing order:', error);
//                                 });
//                             Btradevalue = message.ltp;
//                             BCurrentTrade = 'CE';
//                         } else {
//                             if (BCurrentTrade == 'CE' && Btradevalue != 0) {
//                                 if (Btradevalue > message.ltp) {
//                                     //console.log('Track CE loss @', message.ltp, Math.round(Math.abs(BTradeLossper - (((Btradevalue - message.ltp) / Btradevalue) * 100))));
//                                 } else {
//                                     //console.log('Track CE Profits @', message.ltp, Math.round(Math.abs(BTradeLossper + (((message.ltp - Btradevalue) / Btradevalue) * 100))));
//                                     if (BAbsoluteLoss + (((message.ltp - Btradevalue) / Btradevalue) * 100) > 10) {
//                                         console.log('EXIT CE Trade for 10%  @', message.ltp);
//                                         Btradeside = 'EXITCE';
//                                         //skt.close();
//                                         textreceived = 'WAITFORDATA';
//                                         orderDetails = {
//                                             symbol: BNiftyCE,  // Example symbol (Reliance)
//                                             qty: (15 * BTradex),
//                                             type: 'LIMIT',
//                                             side: 'SELL',
//                                             productType: 'INTRADAY',
//                                             limitPrice: message.ltp - 0.5  // Example limit price
//                                         };                        
//                                         sktorders.placeOrder(orderDetails)
//                                             .then(response => {
//                                                 console.log('Order placed successfully:', response);
//                                             })
//                                             .catch(error => {
//                                                 console.error('Error placing order:', error);
//                                             });
//                                     }
//                                 }
//                             } else {
//                                 if (BCurrentTrade == 'PE' && Btradevalue == 0) {
//                                     console.log('Take Switchtrade CE @', message.ltp);
//                                     Btradevalue = message.ltp;
//                                     BCurrentTrade = 'CE';
//                                 }
//                             }
//                         }
//                     }
//                     if (Btradeside == 'PE') {
//                         if (BCurrentTrade == 'CE' && Btradevalue != 0) {

//                             if (Btradevalue > message.ltp) {
//                                 BTradeLossper = BTradeLossper - (((Btradevalue - message.ltp) / Btradevalue) * 100);
//                                 BAbsoluteLoss = BAbsoluteLoss - (((Btradevalue - message.ltp) / Btradevalue) * 100 * Math.pow(2, (BTradex + 1)));
//                                 console.log('Exit CE LOSS Trade@', message.ltp, ':', BTradeLossper);
//                             } else {//no need for below logic
//                                 BTradeLossper = BTradeLossper + (((message.ltp - Btradevalue) / Btradevalue) * 100);
//                                 console.log('Exit CE PROFIT Trade@', message.ltp, ':', BTradeLossper);
//                             }
//                             orderDetails = {
//                                 symbol: BNiftyCE,  // Example symbol (Reliance)
//                                 qty: (15 * BTradex),
//                                 type: 'LIMIT',
//                                 side: 'SELL',
//                                 productType: 'INTRADAY',
//                                 limitPrice: message.ltp - 0.5  // Example limit price
//                             };                        
//                             sktorders.placeOrder(orderDetails)
//                                 .then(response => {
//                                     console.log('Order placed successfully:', response);
//                                 })
//                                 .catch(error => {
//                                     console.error('Error placing order:', error);
//                                 });
//                             Btradevalue = 0;
//                         }
//                     }
//                     break;
//                 case BNiftyPE:
//                     //console.log('Reached here7', message.ltp);
//                     BLastPEValue = message.ltp;
//                     if (Btradeside == 'PE') {
//                         if (BCurrentTrade == '' && Btradevalue == 0) {
//                             if (TradeLossper < -10) {
//                                 ++Tradex;
//                                 console.log('Take trade PE @', message.ltp, 'Capital : ', Tradex);
//                             } else {
//                                 console.log('Take trade PE @', message.ltp, 'Capital : ', Tradex);
//                             }
//                             orderDetails = {
//                                 symbol: BNiftyPE,  // Example symbol (Reliance)
//                                 qty: (15 * BTradex),
//                                 type: 'LIMIT',
//                                 side: 'BUY',
//                                 productType: 'INTRADAY',
//                                 limitPrice: message.ltp + 0.5  // Example limit price
//                             };                        
//                             sktorders.placeOrder(orderDetails)
//                                 .then(response => {
//                                     console.log('Order placed successfully:', response);
//                                 })
//                                 .catch(error => {
//                                     console.error('Error placing order:', error);
//                                 });
//                             Btradevalue = message.ltp;
//                             BCurrentTrade = 'PE';
//                         } else {
//                             if (BCurrentTrade == 'PE' && Btradevalue != 0) {
//                                 if (Btradevalue > message.ltp) {
//                                     //console.log('Track PE Loss @', message.ltp, Math.round(Math.abs(TradeLossper - (((tradevalue - message.ltp) / tradevalue) * 100))));
//                                 } else {
//                                     //console.log('Track PE Profits @', message.ltp, Math.round(Math.abs(TradeLossper + ((message.ltp - tradevalue) / tradevalue) * 100)));
//                                     if (AbsoluteLoss + (((message.ltp - tradevalue) / tradevalue) * 100) > 10) {
//                                         console.log('EXIT PE Trade for 10%  @', message.ltp);
//                                         tradeside = 'EXITPE';
//                                         //skt.close();
//                                         textreceived = 'WAITFORDATA';
//                                         orderDetails = {
//                                             symbol: BNiftyPE,  // Example symbol (Reliance)
//                                             qty: (15 * BTradex),
//                                             type: 'LIMIT',
//                                             side: 'SELL',
//                                             productType: 'INTRADAY',
//                                             limitPrice: message.ltp - 0.5  // Example limit price
//                                         };                        
//                                         sktorders.placeOrder(orderDetails)
//                                             .then(response => {
//                                                 console.log('Order placed successfully:', response);
//                                             })
//                                             .catch(error => {
//                                                 console.error('Error placing order:', error);
//                                             });
//                                     }
//                                 }


//                             } else {
//                                 if (BCurrentTrade == 'CE' && Btradevalue == 0) {
//                                     console.log('Take Switchtrade PE @', message.ltp);
//                                     Btradevalue = message.ltp;
//                                     BCurrentTrade = 'PE';
//                                 }
//                             }
//                         }
//                     }
//                     if (Btradeside == 'CE') {
//                         if (BCurrentTrade == 'PE' && Btradevalue != 0) {

//                             if (Btradevalue > message.ltp) {
//                                 BTradeLossper = BTradeLossper - (((Btradevalue - message.ltp) / Btradevalue) * 100);
//                                 BAbsoluteLoss = BAbsoluteLoss - (((Btradevalue - message.ltp) / Btradevalue) * 100 * Math.pow(2, (BTradex + 1)));
//                                 console.log('Exit PE LOSS Trade@', message.ltp, ':', BTradeLossper);
//                             } else { // No need below logic
//                                 TradeLossper = TradeLossper + (((message.ltp - Btradevalue) / Btradevalue) * 100);
//                                 console.log('Exit PE PROFIT Trade@', message.ltp, ':', BTradeLossper);
//                             }
//                             orderDetails = {
//                                 symbol: BNiftyPE,  // Example symbol (Reliance)
//                                 qty: (15 * BTradex),
//                                 type: 'LIMIT',
//                                 side: 'SELL',
//                                 productType: 'INTRADAY',
//                                 limitPrice: message.ltp - 0.5  // Example limit price
//                             };                        
//                             sktorders.placeOrder(orderDetails)
//                                 .then(response => {
//                                     console.log('Order placed successfully:', response);
//                                 })
//                                 .catch(error => {
//                                     console.error('Error placing order:', error);
//                                 });
//                             Btradevalue = 0;
//                         }
//                     }

//                     break;

//             }
//         } else {
//             switch (message.symbol) {
//                 case 'NSE:NIFTYBANK-INDEX':
//                     //console.log('reached here', message.ltp);
//                     //add first symbol when formData is received
//                     if (BTagsReceivedState === false) {
//                         BNiftyCE = BGenericTagCEPE + (Number(message.ltp) - (Number(message.ltp) % 100)) + 'CE';
//                         BNiftyPE = BGenericTagCEPE + (Number(message.ltp) - (Number(message.ltp) % 100) + 100) + 'PE';
//                         subscribeList.push(BNiftyCE);
//                         subscribeList.push(BNiftyPE);
//                         console.log('subs list', subscribeList);
//                         skt.subscribe(subscribeList).then(_ => {
//                             //console.log('Inside ', subscribeList);
//                         });
//                         BTagsReceivedState = true;

//                     } else {
//                         if (subscribeList.length != 0) {
//                             if (message.ltp > higherindex) {
//                                 Btradeside = 'CE';
//                                 BtradeDirection = 'BUY';
//                             }

//                             if (message.ltp < lowerindex) {
//                                 Btradeside = 'PE';
//                                 BtradeDirection = 'BUY';
//                             }
//                         }
//                         //console.log('Checking Index @', message.ltp);
//                     }
//                     break;
//                 case BNiftyCE:
//                     if (Btradeside == 'CE') {
//                         console.log('First Trade - Triggered CE @', message.ltp);
//                         BCurrentTrade = 'CE';
//                         Btradevalue = message.ltp;
//                         textreceived = 'TRADE';
//                         orderDetails = {
//                             symbol: BNiftyCE,  // Example symbol (Reliance)
//                             qty: 15,
//                             type: 'LIMIT',
//                             side: 'BUY',
//                             productType: 'INTRADAY',
//                             limitPrice: message.ltp + 0.5  // Example limit price
//                         };                        
//                         sktorders.placeOrder(orderDetails)
//                             .then(response => {
//                                 console.log('Order placed successfully:', response);
//                             })
//                             .catch(error => {
//                                 console.error('Error placing order:', error);
//                             });
//                     }
//                     break;
//                 case BNiftyPE:
//                     if (Btradeside == 'PE') {
//                         console.log('First Trade - Triggered PE @', message.ltp);
//                         BCurrentTrade = 'PE';
//                         Btradevalue = message.ltp;
//                         textreceived = 'TRADE';
//                         orderDetails = {
//                             symbol: BNiftyPE,  // Example symbol (Reliance)
//                             qty: 15,
//                             type: 'LIMIT',
//                             side: 'BUY',
//                             productType: 'INTRADAY',
//                             limitPrice: message.ltp + 0.5  // Example limit price
//                         };                        
//                         sktorders.placeOrder(orderDetails)
//                             .then(response => {
//                                 console.log('Order placed successfully:', response);
//                             })
//                             .catch(error => {
//                                 console.error('Error placing order:', error);
//                             });
//                     }
//                     break;
//             }
//         }

//     }


// });
// skt.connect();