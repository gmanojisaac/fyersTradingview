

var fyersModel = require("fyers-api-v3").fyersModel

var fyers = new fyersModel({ "logs": "path where you want to save logs", "enableLogging": true })

fyers.setAppId("R3PYOUE8EO-100")

fyers.setRedirectUrl("https://trade.fyers.in/api-login/redirect-uri/index.html")

var URL = fyers.generateAuthCode()

console.log(URL)

var authcode = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhcGkubG9naW4uZnllcnMuaW4iLCJpYXQiOjE3MTg3ODM2MTAsImV4cCI6MTcxODgxMzYxMCwibmJmIjoxNzE4NzgzMDEwLCJhdWQiOiJbXCJ4OjBcIiwgXCJ4OjFcIiwgXCJ4OjJcIiwgXCJkOjFcIiwgXCJkOjJcIiwgXCJ4OjFcIiwgXCJ4OjBcIl0iLCJzdWIiOiJhdXRoX2NvZGUiLCJkaXNwbGF5X25hbWUiOiJYTTI3MTgzIiwib21zIjoiSzEiLCJoc21fa2V5IjoiYzhjMjJmMTAxN2MxYTYyYjc2ZjM2OGRhMzk0NTY5YjBlNWJjYmJjNGQyNDEwZTYxYmExNmI5ZTEiLCJub25jZSI6IiIsImFwcF9pZCI6IlIzUFlPVUU4RU8iLCJ1dWlkIjoiZjBhMjQ1NWZiNGYyNDUzZGIyMDFmN2RiZGU3YmEyZWMiLCJpcEFkZHIiOiIwLjAuMC4wIiwic2NvcGUiOiIifQ.Gp8q4xV8fA0_PWKfCi0Y7RHczcYirUZApD58M0jIUsA";
var accesstoken="";


if (accesstoken == '') {
    fyers.generate_access_token({ "client_id": "R3PYOUE8EO-100", "secret_key": "O785RGL68D", "auth_code": authcode }).then((response) => {
        if (response.s == 'ok') {
            fyers.setAccessToken(response.access_token)
            console.log(response.access_token);
        } else {
            console.log("error generating access token", response)
        }
    })
}