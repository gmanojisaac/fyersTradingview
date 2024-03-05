

var fyersModel = require("fyers-api-v3").fyersModel

var fyers = new fyersModel({ "logs": "path where you want to save logs", "enableLogging": true })

fyers.setAppId("P0LFBDKNAW-100")

fyers.setRedirectUrl("https://trade.fyers.in/api-login/redirect-uri/index.html")

var URL = fyers.generateAuthCode()

console.log(URL)

var authcode = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhcGkubG9naW4uZnllcnMuaW4iLCJpYXQiOjE3MDk2MTU0NzAsImV4cCI6MTcwOTY0NTQ3MCwibmJmIjoxNzA5NjE0ODcwLCJhdWQiOiJbXCJ4OjBcIiwgXCJ4OjFcIiwgXCJ4OjJcIiwgXCJkOjFcIiwgXCJkOjJcIiwgXCJ4OjFcIiwgXCJ4OjBcIl0iLCJzdWIiOiJhdXRoX2NvZGUiLCJkaXNwbGF5X25hbWUiOiJYTTI3MTgzIiwib21zIjoiSzEiLCJoc21fa2V5IjoiYzhjMjJmMTAxN2MxYTYyYjc2ZjM2OGRhMzk0NTY5YjBlNWJjYmJjNGQyNDEwZTYxYmExNmI5ZTEiLCJub25jZSI6IiIsImFwcF9pZCI6IlAwTEZCREtOQVciLCJ1dWlkIjoiZWI0NDZhMzJjYjU4NDEwZmE4Nzg2Y2NhNTZkYTAxOWIiLCJpcEFkZHIiOiIwLjAuMC4wIiwic2NvcGUiOiIifQ.s8ylLGo4S5XvupNUOgrR5GPWZTUsJUw8HEYRLDunKXw";
var accesstoken="";


if (accesstoken == '') {
    fyers.generate_access_token({ "client_id": "P0LFBDKNAW-100", "secret_key": "QEWSAJBAWN", "auth_code": authcode }).then((response) => {
        if (response.s == 'ok') {
            fyers.setAccessToken(response.access_token)
            console.log(response.access_token);
        } else {
            console.log("error generating access token", response)
        }
    })
}