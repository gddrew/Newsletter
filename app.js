const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

// Create a public folder in your project, make a folder for your stylesheet
// and a folder for your images and put your files there so that these static
// files will be visible, then app.use(express.static("public"))
app.use(express.static("public"));

// We've already required bodyParser, now we need to tell the app to use it
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){

  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

//create a flatpack json from the data constant defined above
  const jsonData = JSON.stringify(data);

  const url = "https://us14.api.mailchimp.com/3.0/lists/68fb17ac9f";

  const options = {
    method: "POST",
    auth: "string1:a49d74c92e92000066e068c1970e3bc4e-us14"
  }

  const request = https.request(url, options, function(response){

    if (response.statusCode === 200){
      //res.send("Thank you for subscribing!");
      res.sendFile(__dirname + "/success.html");
    } else {
      //res.send("Well this is embarrassing. There was an error. Please try again.")
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data){
      console.log(JSON.parse(data));
    })
  })

  request.write(jsonData);
  request.end();

});

app.post("/failure", function(req, res){
  res.redirect("/")
});

// LOCAL VERSION
//app.listen(3000,function(){

// HEROKU VERSION
//app.listen(process.env.PORT, function) {

// RUN BOTH WAYS (preferred)
app.listen(process.env.PORT || 3000, function) { 
  console.log("App is running on port 3000");
});

//API Key
// 49d74c92e92000066e068c1970e3bc4e-us14
//Audience ID
// 68fb17ac9f
