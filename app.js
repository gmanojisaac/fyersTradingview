const express = require('express');
const bodyParser = require('body-parser');
var fyersModel = require("fyers-api-v3").fyersModel;
let DataSocket = require("fyers-api-v3").fyersDataSocket;
const axios = require('axios');
var fyers = new fyersModel({ "logs": "path where you want to save logs", "enableLogging": false })

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
let BTradex = 0;
let BLastCEValue = 0;
let BLastPEValue = 0;
fyers.setAppId("P0LFBDKNAW-100")

var accesstoken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhcGkuZnllcnMuaW4iLCJpYXQiOjE3MDk2MTU0OTksImV4cCI6MTcwOTY4NTAzOSwibmJmIjoxNzA5NjE1NDk5LCJhdWQiOlsieDowIiwieDoxIiwieDoyIiwiZDoxIiwiZDoyIiwieDoxIiwieDowIl0sInN1YiI6ImFjY2Vzc190b2tlbiIsImF0X2hhc2giOiJnQUFBQUFCbDVxbUxNazlKclNqcEZWd2p2YmREaWo2SU9FZTdOMlUteEJPX2wtTWNwUjJRQUlnZWNmQ3VxcUszLVk1UkItUkJaV1k2dlRIcEVlYldsSnBJWGFPaFpSUG90cGx6SFE0NTRNQnY4SWo2TVlYOEVFMD0iLCJkaXNwbGF5X25hbWUiOiJNQU5PSiBJU0FBQyBHT0RXSU4iLCJvbXMiOiJLMSIsImhzbV9rZXkiOiJjOGMyMmYxMDE3YzFhNjJiNzZmMzY4ZGEzOTQ1NjliMGU1YmNiYmM0ZDI0MTBlNjFiYTE2YjllMSIsImZ5X2lkIjoiWE0yNzE4MyIsImFwcFR5cGUiOjEwMCwicG9hX2ZsYWciOiJOIn0.DwR5ASvnFNzVuOgqlC4aFAiKRFzY3C5PRfT2kBp9KfU";


fyers.setAccessToken(accesstoken);
var skt = DataSocket.getInstance(accesstoken,)
skt.on("connect", function () {
    
    skt.mode(skt.LiteMode);
    console.log('skt connected');
});



// Define a route handler for handling POST requests
app.post('/submit-form', (req, res) => {
    
    // Extract data from the request body
    const formData = req.body;
    console.log('Received: ', formData);
    if (textreceived == 'TRADE') {
        subscribeList.pop(BNiftyPE);
        subscribeList.pop(BNiftyCE);
        BTagsReceivedState = false;
        if (BCurrentTrade == 'CE' && Btradevalue != 0) {
            BTradeLossper = BTradeLossper - (((Btradevalue - BLastCEValue) / Btradevalue) * 100);
            BAbsoluteLoss = BAbsoluteLoss - (((Btradevalue - BLastCEValue) / Btradevalue) * 100 * Math.pow(2, (BTradex + 1)));
            console.log('Exit CE Trade@', BLastCEValue + 0.5, ':', BTradeLossper);
            BCurrentTrade = '';
            Btradeside = '';
            Btradevalue = 0;
            BTradex = 0;
            BTradeLossper = 0;
            BAbsoluteLoss = 0;
        }
        if (BCurrentTrade == 'PE' && Btradevalue != 0) {
            BTradeLossper = BTradeLossper - (((Btradevalue - BLastPEValue) / Btradevalue) * 100);
            BAbsoluteLoss = BAbsoluteLoss - (((Btradevalue - BLastPEValue) / Btradevalue) * 100 * Math.pow(2, (BTradex + 1)));
            console.log('Exit PE Trade@', BLastPEValue + 0.5, ':', BTradeLossper);
            BCurrentTrade = '';
            Btradeside = '';
            Btradevalue = 0;
            BTradex = 0;
            BTradeLossper = 0;
            BAbsoluteLoss = 0;
        }

        textreceived = formData;
        textindex = textreceived.indexOf("is");
        higherindex = textreceived.slice(0, textindex);
        lowerindex = textreceived.slice(textindex + 2, textreceived.length);
        console.log('Higher / lower is ', higherindex, '/', lowerindex);
        textreceived = '';
    } else {
        if (subscribeList.length != 0){ // Sprofit booked next data received
            subscribeList.pop(BNiftyPE);
            subscribeList.pop(BNiftyCE);
            BTagsReceivedState = false;
            skt.subscribe(subscribeList);
            textreceived = formData;
            textindex = textreceived.indexOf("is");
            higherindex = textreceived.slice(0, textindex);
            lowerindex = textreceived.slice(textindex + 2, textreceived.length);
            console.log('Higher / lower is ', higherindex, '/', lowerindex);
            textreceived = '';
        } else{//First Time
            subscribeList.push('NSE:NIFTYBANK-INDEX');
            skt.subscribe(subscribeList);
            textreceived = formData;
            textindex = textreceived.indexOf("is");
            higherindex = textreceived.slice(0, textindex);
            lowerindex = textreceived.slice(textindex + 2, textreceived.length);
            console.log('Higher / lower is ', higherindex, '/', lowerindex);
            textreceived = '';
        }

    }

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

skt.on("message", function (message) {
    //console.log('Reached here1',subscribeList, textreceived);

    if (textreceived == 'WAITFORDATA') {
        subscribeList.pop(BNiftyPE);
        subscribeList.pop(BNiftyCE);
        BTagsReceivedState = false;
        BCurrentTrade = '';
        Btradeside = '';
        Btradevalue = 0;
        BTradex = 0;
        BTradeLossper = 0;
        BAbsoluteLoss = 0;

    } else {
        if(textreceived != ''){//Trade
            //console.log('INTRADE');
            switch (message.symbol) {
                case 'NSE:NIFTYBANK-INDEX':
                    if (message.ltp > higherindex) {
                        if (Btradeside == 'PE'){
                            Btradeside = 'CE';
                            BtradeDirection = 'BUY';
                            console.log('Triggered CE @', message.ltp);
                            textreceived = 'TRADE';
                        }
                    }
    
                    if (message.ltp < lowerindex) {
                        if (Btradeside == 'CE'){
                            Btradeside = 'PE';
                            BtradeDirection = 'BUY';
                            console.log('Triggered PE @', message.ltp);
                            textreceived = 'TRADE';
                        }
                    }
                    //console.log('Checking Index @', message.ltp);                  
                    break;

                case BNiftyCE :
                    BLastCEValue = message.ltp;
                    if (Btradeside == 'CE') {
                        if (BCurrentTrade == '' && Btradevalue == 0) {
                            if (BTradeLossper < -10) {
                                ++BTradex;
                                console.log('Take trade CE @', message.ltp, 'Capital : ', BTradex);
                            } else {
                                console.log('Take trade CE @', message.ltp, 'Capital : ', BTradex);
                            }
                            Btradevalue = message.ltp;
                            BCurrentTrade = 'CE';
                        } else {
                            if (BCurrentTrade == 'CE' && Btradevalue != 0) {
                                if (Btradevalue > message.ltp) {
                                    //console.log('Track CE loss @', message.ltp, Math.round(Math.abs(BTradeLossper - (((Btradevalue - message.ltp) / Btradevalue) * 100))));
                                } else {
                                    //console.log('Track CE Profits @', message.ltp, Math.round(Math.abs(BTradeLossper + (((message.ltp - Btradevalue) / Btradevalue) * 100))));
                                    if (BAbsoluteLoss + (((message.ltp - Btradevalue) / Btradevalue) * 100) > 10) {
                                        console.log('EXIT CE Trade for 10%  @', message.ltp);
                                        Btradeside = 'EXITCE';
                                        //skt.close();
                                        textreceived = 'WAITFORDATA';
                                    }
                                }
                            } else {
                                if (BCurrentTrade == 'PE' && Btradevalue == 0) {
                                    console.log('Take Switchtrade CE @', message.ltp);
                                    Btradevalue = message.ltp;
                                    BCurrentTrade = 'CE';
                                }
                            }
                        }
                    }
                    if (Btradeside == 'PE') {
                        if (BCurrentTrade == 'CE' && Btradevalue != 0) {
    
                            if (Btradevalue > message.ltp) {
                                BTradeLossper = BTradeLossper - (((Btradevalue - message.ltp) / Btradevalue) * 100);
                                BAbsoluteLoss = BAbsoluteLoss - (((Btradevalue - message.ltp) / Btradevalue) * 100 * Math.pow(2, (BTradex + 1)));
                                console.log('Exit CE LOSS Trade@', message.ltp, ':', BTradeLossper);
                            } else {//no need for below logic
                                BTradeLossper = BTradeLossper + (((message.ltp - Btradevalue) / Btradevalue) * 100);
                                console.log('Exit CE PROFIT Trade@', message.ltp, ':', BTradeLossper);
                            }
    
                            Btradevalue = 0;
                        }
                    }
                    break;
                case BNiftyPE :
                    //console.log('Reached here7', message.ltp);
                    BLastPEValue = message.ltp;
                    if (Btradeside == 'PE') {
                        if (BCurrentTrade == '' && Btradevalue == 0) {
                            if (TradeLossper < -10) {
                                ++Tradex;
                                console.log('Take trade PE @', message.ltp, 'Capital : ', Tradex);
                            } else {
                                console.log('Take trade PE @', message.ltp, 'Capital : ', Tradex);
                            }
                            Btradevalue = message.ltp;
                            BCurrentTrade = 'PE';
                        } else {
                            if (BCurrentTrade == 'PE' && Btradevalue != 0) {
                                if (Btradevalue > message.ltp) {
                                    //console.log('Track PE Loss @', message.ltp, Math.round(Math.abs(TradeLossper - (((tradevalue - message.ltp) / tradevalue) * 100))));
                                } else {
                                    //console.log('Track PE Profits @', message.ltp, Math.round(Math.abs(TradeLossper + ((message.ltp - tradevalue) / tradevalue) * 100)));
                                    if (AbsoluteLoss + (((message.ltp - tradevalue) / tradevalue) * 100) > 10) {
                                        console.log('EXIT PE Trade for 10%  @', message.ltp);
                                        tradeside = 'EXITPE';
                                        //skt.close();
                                        textreceived = 'WAITFORDATA';
                                    }
                                }
    
    
                            } else {
                                if (BCurrentTrade == 'CE' && Btradevalue == 0) {
                                    console.log('Take Switchtrade PE @', message.ltp);
                                    Btradevalue = message.ltp;
                                    BCurrentTrade = 'PE';
                                }
                            }
                        }
                    }
                    if (Btradeside == 'CE') {
                        if (BCurrentTrade == 'PE' && Btradevalue != 0) {
    
                            if (Btradevalue > message.ltp) {
                                BTradeLossper = BTradeLossper - (((Btradevalue - message.ltp) / Btradevalue) * 100);
                                BAbsoluteLoss = BAbsoluteLoss - (((Btradevalue - message.ltp) / Btradevalue) * 100 * Math.pow(2, (BTradex + 1)));
                                console.log('Exit PE LOSS Trade@', message.ltp, ':', BTradeLossper);
                            } else { // No need below logic
                                TradeLossper = TradeLossper + (((message.ltp - Btradevalue) / Btradevalue) * 100);
                                console.log('Exit PE PROFIT Trade@', message.ltp, ':', BTradeLossper);
                            }
                            Btradevalue = 0;
                        }
                    }
    
                    break;
    
            }
        }else{
            switch (message.symbol) {
                case 'NSE:NIFTYBANK-INDEX':
                    //console.log('reached here', message.ltp);
                    //add first symbol when formData is received
                    if (BTagsReceivedState === false) {
                        BNiftyCE = BGenericTagCEPE + (Number(message.ltp) - (Number(message.ltp) % 100)) + 'CE';
                        BNiftyPE = BGenericTagCEPE + (Number(message.ltp) - (Number(message.ltp) % 100) + 100) + 'PE';
                        subscribeList.push(BNiftyCE);
                        subscribeList.push(BNiftyPE);
                        console.log('subs list', subscribeList);
                        skt.subscribe(subscribeList).then(_ => {
                            //console.log('Inside ', subscribeList);
                        });
                        BTagsReceivedState = true;
    
                    } else {
                        if(subscribeList.length != 0){
                            if (message.ltp > higherindex) {
                                Btradeside = 'CE';
                                BtradeDirection = 'BUY';
                            }
        
                            if (message.ltp < lowerindex) {
                                Btradeside = 'PE';
                                BtradeDirection = 'BUY';
                            }
                        }
                        //console.log('Checking Index @', message.ltp);
                    }
                    break;
                case BNiftyCE :
                    if (Btradeside == 'CE'){
                        console.log('First Trade - Triggered CE @', message.ltp);
                        BCurrentTrade = 'CE'; 
                        Btradevalue = message.ltp;
                        textreceived = 'TRADE';
                    }
                break;
                case BNiftyPE :
                    if (Btradeside == 'PE'){
                        console.log('First Trade - Triggered PE @', message.ltp);
                        BCurrentTrade = 'PE'; 
                        Btradevalue = message.ltp;
                        textreceived = 'TRADE';
                    }
                break;
            }
        }

    }


});
skt.connect();