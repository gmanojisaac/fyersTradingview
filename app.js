const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
const apiKey = 'k8jfisczsz5bsbff'
const apiSecret = 'kpahn5pws8ccvsamxyuxeb0z2l0dwppb'
const requestToken = 'UhaazqMDdZivBJkS66LBybIDuhRzGws6' //Replace Everyday
//https://kite.trade/connect/login?v=3&api_key=k8jfisczsz5bsbff

let accessToken = '8qYSs3WsIox6FtGvBs4OyzNGhsHSUmR9' //Replace Everyday, Remove it and run the program to get the access token

let GenericTagCE = 'BANKNIFTY2470352000CE' //Replace Friday - Jun 21
let GenericTagPE = 'BANKNIFTY2470353200PE' //Replace Friday - Jun 21
let BGenericTagCEPE = 'BANKNIFTY24JUN' //Replace thursday - Jun 27
let BNiftyCE = ""
let BNiftyPE = ""
let NiftyCE = ""
let NiftyPE = ""

let NiftyCES = ""
let NiftyPES = ""

let LBNiftyCE = ""
let LBNiftyPE = ""
let LNiftyCE = ""
let LNiftyPE = ""

let LNiftyCES = ""
let LNiftyPES = ""

let TBNiftyCE = 0
let TBNiftyPE = 0
let TNiftyCE = 0
let TNiftyPE = 0

let SNiftyCE = 0
let SNiftyPE = 0
let SBNiftyCE = 0
let SBNiftyPE = 0

let Tradex = 1
let BTradex = 1
let minqnty = 25
let Bminqnty = 15

let TOKENNiftyCE = 0
let TOKENNiftyPE = 0
let BTOKENNiftyCE = 0
let BTOKENNiftyPE = 0

let instrumentArr = []
let slip = 0.5;

let reconnectAttempts = 0;
const maxReconnectAttempts = 5;
const reconnectDelay = 3000; // 3 seconds

const KiteConnect = require('kiteconnect').KiteConnect
const KiteTicker = require('kiteconnect').KiteTicker
const kite = new KiteConnect({ api_key: apiKey })

if (accessToken == "") {
  kite
    .generateSession(requestToken, apiSecret)
    .then(response => {
      console.log('Access Token: ', response.access_token)
      //kite.setAccessToken(response.access_token);
    })
    .catch(err => {
      console.error('Error generating session: ', err)
    })
} else {
  kite.setAccessToken(accessToken)
}

const ticker = new KiteTicker({
  api_key: apiKey,
  access_token: accessToken
})
const app = express()

// Middleware for parsing JSON bodies
app.use(bodyParser.text())

// Start the server
const PORT = process.env.PORT || 3200
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

// Define a route handler for handling POST requests

ticker.connect();
ticker.on('connect', () => {
  console.log('Connected to Kite Ticker')
  ticker.subscribe(instrumentArr) // Example instrument token
  ticker.setMode(ticker.modeLTP, instrumentArr)
});

function scheduleReconnect() {
  if (reconnectAttempts < maxReconnectAttempts) {
      reconnectAttempts += 1;
      setTimeout(() => {
          console.log(`Attempting to reconnect... (${reconnectAttempts}/${maxReconnectAttempts})`);
          initializeTicker();
      }, reconnectDelay);
  } else {
      console.error('Max reconnect attempts reached. Giving up.');
  }
}

ticker.on('disconnect', () => {
  console.log('Disconnected from KiteConnect');
  scheduleReconnect();
});


/*
ticker.on('ticks', (ticks) => {
    console.log('Ticks:', ticks);
});
*/
ticker.on('ticks', onTicks)

function onTicks (ticks) {
  //console.log("Ticks: ", ticks);
  ticks.forEach(tick => {
    // if (NiftyCE != "") { //BUY HAS COME from tradingview
    //   if (LNiftyPE != "") {//Already PE trade         //switch trade         //exit profit or loss - switch trade
    //     if (NiftyPE !== "") {
    //       SNiftyPE = tick.last_price - slip;
    //       placeLimitOrder( 'NFO', NiftyPE, minqnty * Tradex, SNiftyPE, kite.TRANSACTION_TYPE_SELL)
    //       removeticker(NiftyPE);
    //       addticker(NiftyCE);
    //       console.log(`Remove for ${tick.instrument_token}: ${tick.last_price}`, " entered : ", TNiftyPE, " Exited at : ",SNiftyPE); 
    //       NiftyPE = ""
    //       TBNiftyPE = 0;
    //     } else {
    //       TNiftyCE = tick.last_price + slip;
    //       placeLimitOrder('NFO',NiftyCE,minqnty * Tradex,TNiftyCE,kite.TRANSACTION_TYPE_BUY)
    //       LNiftyPE = "";
    //       console.log(`Enter again for ${tick.instrument_token}: ${tick.last_price}`, " entered : ", TNiftyCE); 
    //     }
    //   } else { //First Time BUY
    //     if (TNiftyCE == 0) {
    //       TNiftyCE = tick.last_price + slip;
    //       placeLimitOrder('NFO',NiftyCE,minqnty * Tradex,TNiftyCE,kite.TRANSACTION_TYPE_BUY)
    //       console.log(`Enter for ${tick.instrument_token}: ${tick.last_price}`, " entered : ", TNiftyCE); 
    //     } else { //CHECK FOR PROFIT
    //       if (tick.last_price > TNiftyCE * 1.13) {
    //         SNiftyCE = tick.last_price - slip; //used for adding profit
    //         placeLimitOrder('NFO',NiftyCE,minqnty * Tradex,SNiftyCE,kite.TRANSACTION_TYPE_SELL);
    //         removeticker(NiftyCE);
    //         NiftyCE = "";
    //         TNiftyCE = 0;
    //         console.log(`Profit for ${tick.instrument_token}: ${tick.last_price}`, " entered : ", TNiftyCE, " Exited at : ",SNiftyCE); 
    //       }else{
    //         //console.log(`In Trade for ${tick.instrument_token}: ${tick.last_price}`, " entered : ", TNiftyCE);
    //       }
    //     }
    //   }
    // }
    // if (NiftyPE != "") { //BUY HAS COME from tradingview
    //     if (LNiftyCE != "") {//Already PE trade         //switch trade         //exit profit or loss - switch trade
    //       if (NiftyCE !== "") {
    //         SNiftyCE = tick.last_price - slip,
    //         placeLimitOrder( 'NFO', NiftyCE, minqnty * Tradex, SNiftyCE, kite.TRANSACTION_TYPE_SELL);
    //         removeticker(NiftyCE);
    //         addticker(NiftyPE);
    //         console.log(`Remove for ${tick.instrument_token}: ${tick.last_price}`, " entered : ", TNiftyCE, " Exited at : ",SNiftyCE);             
    //         NiftyCE = ""
    //         TNiftyCE = 0;
    //       } else {
    //         TNiftyPE = tick.last_price + slip;
    //         placeLimitOrder('NFO',NiftyPE,minqnty * Tradex,TNiftyPE,kite.TRANSACTION_TYPE_BUY)
    //         LNiftyCE = "";
    //         console.log(`Enter again for ${tick.instrument_token}: ${tick.last_price}`, " entered : ", TNiftyPE); 
    //       }
    //     } else { //First Time BUY
    //       if (TNiftyPE == 0) {
    //         TNiftyPE = tick.last_price + slip;
    //         placeLimitOrder('NFO',NiftyPE,minqnty * Tradex,TNiftyPE,kite.TRANSACTION_TYPE_BUY);
    //         console.log(`Enter for ${tick.instrument_token}: ${tick.last_price}`, " entered : ", TNiftyPE); 
    //       } else { //CHECK FOR PROFIT
    //         if (tick.last_price > TNiftyPE * 2.0) {
    //           SNiftyPE = tick.last_price - slip; //used for adding profit
    //           placeLimitOrder('NFO',NiftyPE,minqnty * Tradex,SNiftyPE,kite.TRANSACTION_TYPE_SELL);
    //           removeticker(NiftyPE);
    //           TNiftyPE = 0;
    //           NiftyPE = "";
    //           console.log(`Profit for ${tick.instrument_token}: ${tick.last_price}`, " entered : ", TNiftyPE, " Exited at : ",SNiftyPE); 
    //         }else{
    //           //console.log(`In Trade for ${tick.instrument_token}: ${tick.last_price}`, " entered : ", TNiftyPE);
    //         }
    //       }
    //     }
    // }

    if (NiftyCE != "") { //BUY HAS COME from tradingview
      if (LNiftyCES != "") {//Already PE trade         //switch trade         //exit profit or loss - switch trade
        if (NiftyCES !== "") {
          SNiftyCES = tick.last_price - slip;
          placeLimitOrder( 'NFO', NiftyCES, minqnty * Tradex, SNiftyCES, kite.TRANSACTION_TYPE_SELL)
          removeticker(NiftyCES);
          console.log(`Remove for ${tick.instrument_token}: ${tick.last_price}`, " entered : ", TNiftyPE, " Exited at : ",SNiftyPE); 
          NiftyCES = ""
          TBNiftyCES = 0;
        }
      } else { //First Time BUY
        if (TNiftyCE == 0) {
          TNiftyCE = tick.last_price + slip;
          placeLimitOrder('NFO',NiftyCE,minqnty * Tradex,TNiftyCE,kite.TRANSACTION_TYPE_BUY)
          console.log(`Enter for ${tick.instrument_token}: ${tick.last_price}`, " entered : ", TNiftyCE); 
        } else { //CHECK FOR PROFIT
          if (tick.last_price > TNiftyCE * 1.13) {
            SNiftyCE = tick.last_price - slip; //used for adding profit
            placeLimitOrder('NFO',NiftyCE,minqnty * Tradex,SNiftyCE,kite.TRANSACTION_TYPE_SELL);
            removeticker(NiftyCE);
            NiftyCE = "";
            TNiftyCE = 0;
            console.log(`Profit for ${tick.instrument_token}: ${tick.last_price}`, " entered : ", TNiftyCE, " Exited at : ",SNiftyCE); 
          }else{
            console.log(`In Trade for ${tick.instrument_token}: ${tick.last_price}`, " entered : ", TNiftyCE);
          }
        }
      }
    }
    if (NiftyPE != "") { //BUY HAS COME from tradingview
        if (LNiftyPES != "") {//Already PE trade         //switch trade         //exit profit or loss - switch trade
          if (NiftyPES !== "") {
            SNiftyPES = tick.last_price - slip,
            placeLimitOrder( 'NFO', NiftyPES, minqnty * Tradex, SNiftyPES, kite.TRANSACTION_TYPE_SELL);
            removeticker(NiftyPES);
            console.log(`Remove for ${tick.instrument_token}: ${tick.last_price}`, " entered : ", TNiftyCE, " Exited at : ",SNiftyCE);             
            NiftyPES = ""
            TNiftyPES = 0;
          } 
        } else { //First Time BUY
          if (TNiftyPE == 0) {
            TNiftyPE = tick.last_price + slip;
            placeLimitOrder('NFO',NiftyPE,minqnty * Tradex,TNiftyPE,kite.TRANSACTION_TYPE_BUY);
            console.log(`Enter for ${tick.instrument_token}: ${tick.last_price}`, " entered : ", TNiftyPE); 
          } else { //CHECK FOR PROFIT
            if (tick.last_price > TNiftyPE * 2.0) {
              SNiftyPE = tick.last_price - slip; //used for adding profit
              placeLimitOrder('NFO',NiftyPE,minqnty * Tradex,SNiftyPE,kite.TRANSACTION_TYPE_SELL);
              removeticker(NiftyPE);
              TNiftyPE = 0;
              NiftyPE = "";
              console.log(`Profit for ${tick.instrument_token}: ${tick.last_price}`, " entered : ", TNiftyPE, " Exited at : ",SNiftyPE); 
            }else{
              console.log(`In Trade for ${tick.instrument_token}: ${tick.last_price}`, " entered : ", TNiftyPE);
            }
          }
        }
    }


  if (BNiftyCE != "") { //BUY HAS COME from tradingview
      if (LBNiftyPE != "") {//Already PE trade         //switch trade         //exit profit or loss - switch trade
        if (NiftyPE !== "") {
          SBNiftyPE = tick.last_price - slip;
          placeLimitOrder( 'NFO', BNiftyPE, minqnty * BTradex, SBNiftyPE, kite.TRANSACTION_TYPE_SELL);
          removeticker(BNiftyPE);
          addticker(BNiftyCE);
          console.log(`Remove for ${tick.instrument_token}: ${tick.last_price}`, " entered : ", TBNiftyPE, " Exited at : ",SBNiftyPE); 
          BNiftyPE = "";
          TBNiftyPE = 0;
        } else {
          TBNiftyCE = tick.last_price + slip;
          placeLimitOrder('NFO',BNiftyCE,minqnty * BTradex,TBNiftyCE,kite.TRANSACTION_TYPE_BUY);
          LBNiftyPE = "";
          console.log(`Enter again for ${tick.instrument_token}: ${tick.last_price}`, " entered : ", TBNiftyCE); 
        }
      } else { //First Time BUY
        if (TBNiftyCE == 0) {
          TBNiftyCE = tick.last_price + slip;
          placeLimitOrder('NFO',BNiftyCE,minqnty * BTradex,TBNiftyCE,kite.TRANSACTION_TYPE_BUY);
          console.log(`Enter for ${tick.instrument_token}: ${tick.last_price}`, " entered : ", TBNiftyCE); 
        } else { //CHECK FOR PROFIT
          if (tick.last_price > TBNiftyCE * 2.0) {
            SBNiftyCE = tick.last_price - slip; //used for adding profit
            placeLimitOrder('NFO',BNiftyCE,minqnty * BTradex,SBNiftyCE,kite.TRANSACTION_TYPE_SELL);
            removeticker(BNiftyCE);
            TBNiftyCE = 0;
            BNiftyCE = "";
            console.log(`Profit for ${tick.instrument_token}: ${tick.last_price}`, " entered : ", TBNiftyCE, " Exited at : ",SBNiftyCE); 
          }else{
            //console.log(`In Trade for ${tick.instrument_token}: ${tick.last_price}`, " entered : ", TBNiftyCE);
          }
        }
      }
    }
  if (BNiftyPE != "") { //BUY HAS COME from tradingview
      if (LBNiftyCE != "") {//Already PE trade         //switch trade         //exit profit or loss - switch trade
        if (BNiftyCE !== "") {
          SBNiftyCE = tick.last_price - slip;
          placeLimitOrder( 'NFO', BNiftyCE, minqnty * BTradex, SBNiftyCE, kite.TRANSACTION_TYPE_SELL);
          removeticker(BNiftyCE);
          addticker(BNiftyPE);
          console.log(`Remove for ${tick.instrument_token}: ${tick.last_price}`, " entered : ", TBNiftyCE, " Exited at : ",SBNiftyCE);           
          BNiftyCE = "";
          TBNiftyCE = 0;
        } else {
          TBNiftyPE = tick.last_price + slip;
          placeLimitOrder('NFO',BNiftyPE,minqnty * BTradex,TBNiftyPE,kite.TRANSACTION_TYPE_BUY);
          LBNiftyCE = "";
          console.log(`Enter again for ${tick.instrument_token}: ${tick.last_price}`, " entered : ", TBNiftyPE); 
        }
      } else { //First Time BUY
        if (TBNiftyPE == 0) {
          TBNiftyPE = tick.last_price + slip;
          placeLimitOrder('NFO',BNiftyPE,minqnty * BTradex,TBNiftyPE,kite.TRANSACTION_TYPE_BUY);
          console.log(`Enter for ${tick.instrument_token}: ${tick.last_price}`, " entered : ", TBNiftyPE); 
        } else { //CHECK FOR PROFIT
          if (tick.last_price > TBNiftyPE * 2.0) {
            SBNiftyPE = tick.last_price - slip; //used for adding profit
            placeLimitOrder('NFO',BNiftyPE,minqnty * BTradex,SBNiftyPE,kite.TRANSACTION_TYPE_SELL);
            removeticker(BNiftyPE);
            console.log(`Profit for ${tick.instrument_token}: ${tick.last_price}`, " entered : ", TBNiftyPE, " Exited at : ",SBNiftyPE); 
            TBNiftyPE = 0;
            BNiftyCE = "";
          }else{
            //console.log(`In Trade for ${tick.instrument_token}: ${tick.last_price}`, " entered : ", TBNiftyPE);
          }
        }
      }
  }

  })
}

function placeLimitOrder (
  exchange,
  tradingsymbol,
  quantity,
  price,
  transactionType
) {
  console.log(
    'placeorder',
    exchange,
    tradingsymbol,
    quantity,
    price,
    transactionType
  )
  if (transactionType === kite.TRANSACTION_TYPE_BUY) {
    const orderParams = {
      exchange: exchange,
      tradingsymbol: tradingsymbol,
      transaction_type: kite.TRANSACTION_TYPE_BUY, // or kite.TRANSACTION_TYPE_SELL
      quantity: quantity,
      price: price + slip,
      order_type: kite.ORDER_TYPE_LIMIT,
      product: kite.PRODUCT_MIS, // or kite.PRODUCT_MIS for intraday
      validity: kite.VALIDITY_DAY
    }
    kite
      .placeOrder(kite.VARIETY_REGULAR, orderParams)
      .then(order => {
        console.log('Order placed successfully. Order ID: ', order.order_id);
      })
      .catch(err => {
        console.error('Error placing order: ', err);
      })
  } else {
    const orderParams = {
      exchange: exchange,
      tradingsymbol: tradingsymbol,
      transaction_type: kite.TRANSACTION_TYPE_SELL, // or kite.TRANSACTION_TYPE_SELL
      quantity: quantity,
      price: price,
      order_type: kite.ORDER_TYPE_LIMIT,
      product: kite.PRODUCT_MIS, // or kite.PRODUCT_MIS for intraday
      validity: kite.VALIDITY_DAY
    }
    kite
      .placeOrder(kite.VARIETY_REGULAR, orderParams)
      .then(order => {
        console.log('Order placed successfully. Order ID: ', order.order_id);
      })
      .catch(err => {
        console.error('Error placing order: ', err);
      })
  }
}

function addticker (symbol) {
  kite.getInstruments('NFO').then(instruments => {
    // Find the specific Nifty option
    //const tradingsymbol = "NIFTY2462023500CE"; // Example symbol, replace with your desired symbol
    console.log(symbol);
    const instrument = instruments.find(inst => inst.tradingsymbol === symbol)

    if (instrument) {
      //console.log( `Instrument token for ${symbol}: ${instrument.instrument_token}`);
      instrumentArr.push(Number(instrument.instrument_token));
      ticker.subscribe(instrumentArr);
      console.log("Added : ", instrumentArr);
      ticker.setMode(ticker.modeLTP, instrumentArr)
    } else {
      console.error('Instrument not found')
    }

    // Now you can make API calls
    //getProfile();
  })
}

function removeticker (symbol) {
  kite.getInstruments('NFO').then(instruments => {
    // Find the specific Nifty option
    //const tradingsymbol = "NIFTY2462023500CE"; // Example symbol, replace with your desired symbol
    const instrument = instruments.find(inst => inst.tradingsymbol === symbol);

    if (instrument) {
      console.log(
        `Instrument token for ${symbol}: ${instrument.instrument_token}`
      )
      instrumentArr.pop(Number(instrument.instrument_token));
      ticker.subscribe(instrumentArr);
      ticker.setMode(ticker.modeLTP, instrumentArr);
    } else {
      console.error('Instrument not found')
    }
    // Now you can make API calls
    //getProfile();
  })
}

app.post('/submit-form', async (req, res) => {
  const formData = req.body
  //console.log('Received: ', formData)
  let inputString = String(formData)
  console.log(
    'command:',
    inputString.split(' ')[0],
    '/',
    ' value :',
    inputString.slice(-8)
  )
  switch (inputString.split(' ')[0]) {
    case 'BUYNIFTY':
      // if (NiftyPE != "") { //BUY comes after SELL
      //   LNiftyPE = NiftyPE; //save the symbol for switch trade and exit PE trade
      //   NiftyCE = GenericTagCEPE + (parseInt(inputString.slice(-8)) - (parseInt(inputString.slice(-8)) % 50)) + 'CE'; //  what trade needs to be switched
      // } else {
      //   if (NiftyCE == "" ){//First Time
      //     NiftyCE = GenericTagCEPE + (parseInt(inputString.slice(-8)) - (parseInt(inputString.slice(-8)) % 50)) + 'CE'; //  what trade needs to be switched
      //     addticker(NiftyCE);
      //   }
      // }

        if (NiftyCE == "" ){//First Time
          NiftyCE = GenericTagCE; //  what trade needs to be switched
          addticker(NiftyCE);
        }

      break
    case 'SELLNIFTY':
      // if (LNiftyCE != "") { //holds the symbol and not started
      //   LNiftyCE = NiftyCE; //save the symbol for switch trade
      //   NiftyPE = GenericTagCEPE + (parseFloat(inputString.slice(-8)) - (parseFloat(inputString.slice(-8)) % 50)) + 'PE'; //  what trade needs to be switched
      // } else {
      //   if (NiftyPE == "" ){
      //   NiftyPE = GenericTagCEPE + (parseFloat(inputString.slice(-8)) - (parseFloat(inputString.slice(-8)) % 50)) + 'PE'; //  what trade needs to be switched
      //   addticker(NiftyPE);
      //   }
      // }


      if (NiftyPE == "" ){
      NiftyPE = GenericTagPE; //  what trade needs to be switched
      addticker(NiftyPE);
      }
  
      break;
    
    case 'BUYBNIFTY':
      if (BNiftyPE != "") { //holds the symbol and not started
        LBNiftyPE = BNiftyPE; //save the symbol for switch trade and exit PE trade
        BNiftyCE = BGenericTagCEPE + (parseInt(inputString.slice(-8)) - (parseInt(inputString.slice(-8)) % 50)) + 'CE'; //  what trade needs to be switched
      } else {
        if (BNiftyCE == "" ){
        BNiftyCE = BGenericTagCEPE + (parseInt(inputString.slice(-8)) - (parseInt(inputString.slice(-8)) % 50)) + 'CE'; //  what trade needs to be switched
        addticker(BNiftyCE);
        }
      }
      break
    case 'SELLBNIFTY':
      if (LBNiftyCE != 0) { //holds the symbol and not started
        LBNiftyCE = BNiftyCE; //save the symbol for switch trade
        BNiftyPE = BGenericTagCEPE + (parseFloat(inputString.slice(-8)) - (parseFloat(inputString.slice(-8)) % 50)) + 'PE'; //  what trade needs to be switched
      } else {
        if (BNiftyPE == "" ){
          BNiftyPE = BGenericTagCEPE + (parseFloat(inputString.slice(-8)) - (parseFloat(inputString.slice(-8)) % 50)) + 'PE'; //  what trade needs to be switched
          addticker(BNiftyPE);
        }
    break;
      
      
      
      
      }
    

      case 'BUYNIFTYC':
        if (NiftyCES != "") { //BUY comes after SELL
          LNiftyCES = NiftyCES; //save the symbol for switch trade and exit PE trade
          //NiftyCE = GenericTagCEPE + (parseInt(inputString.slice(-8)) - (parseInt(inputString.slice(-8)) % 50)) + 'CE'; //  what trade needs to be switched
        }
      break
    case 'SELLNIFTYC':
      if (LNiftyPES != "") { //holds the symbol and not started
        LNiftyPES = NiftyPES; //save the symbol for switch trade
        //NiftyPE = GenericTagCEPE + (parseFloat(inputString.slice(-8)) - (parseFloat(inputString.slice(-8)) % 50)) + 'PE'; //  what trade needs to be switched
      } 
      break;
    
    case 'BUYBNIFTYC':
      if (BNiftyPE != "") { //holds the symbol and not started
        LBNiftyPE = BNiftyPE; //save the symbol for switch trade and exit PE trade
        BNiftyCE = BGenericTagCEPE + (parseInt(inputString.slice(-8)) - (parseInt(inputString.slice(-8)) % 50)) + 'CE'; //  what trade needs to be switched
      } else {
        if (BNiftyCE == "" ){
        BNiftyCE = BGenericTagCEPE + (parseInt(inputString.slice(-8)) - (parseInt(inputString.slice(-8)) % 50)) + 'CE'; //  what trade needs to be switched
        addticker(BNiftyCE);
        }
      }
      break
    case 'SELLBNIFTYC':
      if (LBNiftyCE != 0) { //holds the symbol and not started
        LBNiftyCE = BNiftyCE; //save the symbol for switch trade
        BNiftyPE = BGenericTagCEPE + (parseFloat(inputString.slice(-8)) - (parseFloat(inputString.slice(-8)) % 50)) + 'PE'; //  what trade needs to be switched
      } else {
        if (BNiftyPE == "" ){
          BNiftyPE = BGenericTagCEPE + (parseFloat(inputString.slice(-8)) - (parseFloat(inputString.slice(-8)) % 50)) + 'PE'; //  what trade needs to be switched
          addticker(BNiftyPE);
        }
    break;
      
      
      
      
      }
    }

  // Process the form data (here, just sending it back as a response)
  res.json({ message: 'Form submitted successfully', formData })
})
