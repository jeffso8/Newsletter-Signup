const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https")
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  const firstName = req.body.name1;
  const lastName = req.body.name2;
  const email = req.body.email;

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };
  const jsonData = JSON.stringify(data);
  const url = "https://us17.api.mailchimp.com/3.0/lists/42aeaaddfb"

  const options = {
    method: "POST",
    auth: "jeffso8:ac16985df7fc7bf11113cae4a76b62f5-us17"
  };

  const request = https.request(url, options, function(response) {

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html")
    };

    response.on("data", function(data) {
      console.log(JSON.parse(data))
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", function(req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000");
});

//mailchimp API Key: ac16985df7fc7bf11113cae4a76b62f5-us17
//mailchimp List ID: 42aeaaddfb
