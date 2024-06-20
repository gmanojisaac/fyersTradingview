const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const apiKey = "k8jfisczsz5bsbff";
const apiSecret = "kpahn5pws8ccvsamxyuxeb0z2l0dwppb";
const requestToken = "0b8OHB4AhazbCgTJN2cCpD9UNjbudXkJ"; //Replace Everyday
let accessToken = "YQ91ZYEmbVhEhRhQheHDCKbYQdevFD7A"; //Replace Everyday

let GenericTagCEPE = "NIFTY24620"; //Replace Friday - Jun 21
let BGenericTagCEPE = "BANKNIFTY24JUN"; //Replace thursday - Jun 27
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

let Tradex = 1;
let BTradex = 1;
let minqnty = 25;
let Bminqnty = 15;

let instrumentArr = [];

const KiteConnect = require("kiteconnect").KiteConnect;
const KiteTicker = require("kiteconnect").KiteTicker;
const kite = new KiteConnect({ api_key: apiKey });


if (accessToken == "") {
  kite
    .generateSession(requestToken, apiSecret)
    .then((response) => {
      console.log("Access Token: ", response.access_token);
      //kite.setAccessToken(response.access_token);
    })
    .catch((err) => {
      console.error("Error generating session: ", err);
    });
} else {
  kite.setAccessToken(accessToken);
}


const ticker = new KiteTicker({
  api_key: apiKey,
  access_token: accessToken,
});
const app = express();

// Middleware for parsing JSON bodies
app.use(bodyParser.text());

// Define a route handler for handling POST requests
app.post("/submit-form", async (req, res) => {
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
      case "BUYNIFTY":
        if (NiftyPE != "") {
          //holds the symbol and not started
          LNiftyPE = NiftyPE; //save the symbol for switch trade
          NiftyCE =
            GenericTagCEPE +
            (parseInt(inputString.slice(-8)) -
              (parseInt(inputString.slice(-8)) % 50)) +
            "CE"; //  what trade needs to be switched
        } else {
          NiftyCE =
            GenericTagCEPE +
            (parseInt(inputString.slice(-8)) -
              (parseInt(inputString.slice(-8)) % 50)) +
            "CE"; //  what trade needs to be switched
          addticker(NiftyCE);
        }
  
        break;
      case "SELLNIFTY":
        if (NiftyCE != "") {
          //holds the symbol and not started
          LNiftyCE = NiftyCE; //save the symbol for switch trade
          NiftyPE =
            GenericTagCEPE +
            (parseFloat(inputString.slice(-8)) -
              (parseFloat(inputString.slice(-8)) % 50)) +
            "PE"; //  what trade needs to be switched
        } else {
          NiftyPE =
            GenericTagCEPE +
            (parseFloat(inputString.slice(-8)) -
              (parseFloat(inputString.slice(-8)) % 50)) +
            "PE"; //  what trade needs to be switched
          addticker(NiftyPE);
        }
  
        break;
      case "BUYBNIFTY":
        if (BNiftyPE != "") {
          //holds the symbol and not started
          LBNiftyPE = BNiftyPE; //save the symbol for switch trade
          BNiftyCE =
            BGenericTagCEPE +
            (parseFloat(inputString.slice(-8)) -
              (parseFloat(inputString.slice(-8)) % 100)) +
            "CE"; //  what trade needs to be switched
        } else {
          BNiftyCE =
            BGenericTagCEPE +
            (parseFloat(inputString.slice(-8)) -
              (parseFloat(inputString.slice(-8)) % 100)) +
            "CE"; //  what trade needs to be switched
          addticker(BNiftyCE);
        }
        break;
      case "SELLBNIFTY":
        if (BNiftyCE != "") {
          //holds the symbol and not started
          LBNiftyCE = BNiftyCE; //save the symbol for switch trade
          BNiftyPE =
            BGenericTagCEPE +
            (parseFloat(inputString.slice(-8)) -
              (parseFloat(inputString.slice(-8)) % 100)) +
            "PE"; //  what trade needs to be switched
        } else {
          BNiftyPE =
            BGenericTagCEPE +
            (parseFloat(inputString.slice(-8)) -
              (parseFloat(inputString.slice(-8)) % 100)) +
            "PE"; //  what trade needs to be switched
          addticker(BNiftyPE);
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

function placeLimitOrder(
  exchange,
  tradingsymbol,
  quantity,
  price,
  transactionType
) {
  if (transactionType === kite.TRANSACTION_TYPE_BUY) {
    const orderParams = {
      exchange: exchange,
      tradingsymbol: tradingsymbol,
      transaction_type: kite.TRANSACTION_TYPE_BUY, // or kite.TRANSACTION_TYPE_SELL
      quantity: quantity,
      price: price + 0.5,
      order_type: kite.ORDER_TYPE_LIMIT,
      product: kite.PRODUCT_MIS, // or kite.PRODUCT_MIS for intraday
      validity: kite.VALIDITY_DAY,
    };
  } else {
    const orderParams = {
      exchange: exchange,
      tradingsymbol: tradingsymbol,
      transaction_type: kite.TRANSACTION_TYPE_SELL, // or kite.TRANSACTION_TYPE_SELL
      quantity: quantity,
      price: price,
      order_type: kite.ORDER_TYPE_LIMIT,
      product: kite.PRODUCT_MIS, // or kite.PRODUCT_MIS for intraday
      validity: kite.VALIDITY_DAY,
    };
  }
  kite
    .placeOrder(kite.VARIETY_REGULAR, orderParams)
    .then((order) => {
      console.log("Order placed successfully. Order ID: ", order.order_id);
    })
    .catch((err) => {
      console.error("Error placing order: ", err);
    });
}



function addticker(symbol) {
  kite.getInstruments("NFO").then((instruments) => {
    // Find the specific Nifty option
    //const tradingsymbol = "NIFTY2462023500CE"; // Example symbol, replace with your desired symbol
    console.log(symbol);
    const instrument = instruments.find(
      (inst) => inst.tradingsymbol === symbol
    );

    if (instrument) {
      console.log(
        `Instrument token for ${symbol}: ${instrument.instrument_token}`
      );
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

function removeticker(symbol) {
  kite.getInstruments("NFO").then((instruments) => {
    // Find the specific Nifty option
    //const tradingsymbol = "NIFTY2462023500CE"; // Example symbol, replace with your desired symbol
    const instrument = instruments.find(
      (inst) => inst.tradingsymbol === symbol
    );

    if (instrument) {
      console.log(
        `Instrument token for ${symbol}: ${instrument.instrument_token}`
      );
      instrumentArr.pop(instrument.instrument_token);
      ticker.subscribe(instrumentArr);
      ticker.setMode(ticker.modeLTP, instrumentArr);
    } else {
      console.error("Instrument not found");
    }
    // Now you can make API calls
    //getProfile();
  });
}



ticker.connect();

ticker.on("ticks", onTicks);
ticker.on("connect", subscribe);

function subscribe() {
  const items = [738561]; // Replace with the instrument token of the symbol you want to subscribe to
  console.log("Reached");
}

function onTicks(ticks) {
    console.log("Ticks: ", ticks);
    ticks.forEach((tick) => {
      console.log(`LTP for ${tick.instrument_token}: ${tick.last_price}`);
  
      if (NiftyCE != "") {
        if (LNiftyPE != "") {
          //switch trade
          //exit profit or loss - switch trade
          switch (tick.instrument_token) {
            case NiftyCE:
              TNiftyCE = tick.last_price + 0.5;
              placeLimitOrder(
                "NFO",
                tick.instrument_token,
                minqnty * Tradex,
                TNiftyCE,
                kite.TRANSACTION_TYPE_BUY
              );
              LNiftyPE = "";
              break;
            case NiftyPE:
              SNiftyPE = tick.last_price - 0.5;
              placeLimitOrder(
                "NFO",
                tick.instrument_token,
                minqnty * Tradex,
                SNiftyPE,
                kite.TRANSACTION_TYPE_SELL
              );
              removeticker(NiftyPE);
              addticker(NiftyCE);
              NiftyPE = "";
              break;
          }
        } else {
          if (TNiftyCE == 0) {
            TNiftyCE = tick.last_price + 0.5;
            placeLimitOrder(
              "NFO",
              tick.instrument_token,
              minqnty * Tradex,
              TNiftyCE,
              kite.TRANSACTION_TYPE_BUY
            );
          } else {
            if (tick.last_price > TNiftyCE * 1.1) {
              SNiftyCE = tick.last_price - 0.5;
              placeLimitOrder(
                "NFO",
                tick.instrument_token,
                minqnty * Tradex,
                SNiftyCE,
                kite.TRANSACTION_TYPE_SELL
              );
              removeticker(NiftyCE);
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
              placeLimitOrder(
                "NFO",
                tick.instrument_token,
                minqnty * Tradex,
                TNiftyPE,
                kite.TRANSACTION_TYPE_BUY
              );
              LNiftyCE = "";
              break;
            case NiftyCE:
              SNiftyCE = tick.last_price - 0.5;
              placeLimitOrder(
                "NFO",
                tick.instrument_token,
                minqnty * Tradex,
                SNiftyCE,
                kite.TRANSACTION_TYPE_SELL
              );
              removeticker(NiftyCE);
              addticker(NiftyPE);
              NiftyCE = "";
              break;
          }
        } else {
          if (TNiftyPE == 0) {
            TNiftyPE = tick.last_price + 0.5;
            placeLimitOrder(
              "NFO",
              tick.instrument_token,
              minqnty * Tradex,
              TNiftyPE,
              kite.TRANSACTION_TYPE_BUY
            );
          } else {
            if (tick.last_price > TNiftyPE * 1.1) {
              SNiftyPE = tick.last_price - 0.5;
              placeLimitOrder(
                "NFO",
                tick.instrument_token,
                minqnty * Tradex,
                SNiftyPE,
                kite.TRANSACTION_TYPE_SELL
              );
              removeticker(NiftyPE);
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
              placeLimitOrder(
                "NFO",
                tick.instrument_token,
                Bminqnty * BTradex,
                TBNiftyCE,
                kite.TRANSACTION_TYPE_BUY
              );
              LBNiftyPE = "";
              break;
            case BNiftyPE:
              SBNiftyPE = tick.last_price - 0.5;
              placeLimitOrder(
                "NFO",
                tick.instrument_token,
                Bminqnty * BTradex,
                SBNiftyPE,
                kite.TRANSACTION_TYPE_SELL
              );
              removeticker(BNiftyPE);
              addticker(BNiftyCE);
              BNiftyPE = "";
              break;
          }
        } else {
          if (TBNiftyCE == 0) {
            TBNiftyCE = tick.last_price + 0.5;
            placeLimitOrder(
              "NFO",
              tick.instrument_token,
              Bminqnty * BTradex,
              TBNiftyCE,
              kite.TRANSACTION_TYPE_BUY
            );
          } else {
            if (tick.last_price > TBNiftyCE * 1.1) {
              SBNiftyCE = tick.last_price - 0.5;
              placeLimitOrder(
                "NFO",
                tick.instrument_token,
                Bminqnty * BTradex,
                SBNiftyCE,
                kite.TRANSACTION_TYPE_SELL
              );
              removeticker(BNiftyCE);
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
              placeLimitOrder(
                "NFO",
                tick.instrument_token,
                Bminqnty * BTradex,
                TBNiftyPE,
                kite.TRANSACTION_TYPE_BUY
              );
              LBNiftyCE = "";
              break;
            case BNiftyCE:
              SBNiftyCE = tick.last_price - 0.5;
              placeLimitOrder(
                "NFO",
                tick.instrument_token,
                Bminqnty * BTradex,
                SBNiftyCE,
                kite.TRANSACTION_TYPE_SELL
              );
              removeticker(BNiftyCE);
              addticker(BNiftyPE);
              BNiftyCE = "";
              break;
          }
        } else {
          if (TBNiftyPE == 0) {
            TBNiftyPE = tick.last_price + 0.5;
            placeLimitOrder(
              "NFO",
              tick.instrument_token,
              Bminqnty * BTradex,
              TBNiftyPE,
              kite.TRANSACTION_TYPE_BUY
            );
          } else {
            if (tick.last_price > TBNiftyPE * 1.1) {
              SBNiftyPE = tick.last_price - 0.5;
              placeLimitOrder(
                "NFO",
                tick.instrument_token,
                Bminqnty * BTradex,
                SBNiftyPE,
                kite.TRANSACTION_TYPE_SELL
              );
              removeticker(BNiftyPE);
            }
          }
        }
      }
    });
  }
