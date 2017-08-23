//Set up
var express = require('express');
//help return json object
var bodyParser = require('body-parser');
var cors = require('cors');
//
var mongoose = require('mongoose');

//structure of document
var shortUrl = require('./models/shortUrl')

var app = express();

app.use(cors());
app.use(bodyParser.json());
//connect to the database, local database or horoko
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/shortUrls');

//allow node to find static content
app.use(express.static(__dirname +'/public'));



//create the database entry
app.get('/new/:urlToShorten(*)', (req, res, next)=>{

//ES5 var urlToShorten = req.params.urlToShorten
var {urlToShorten} = req.params;
console.log(urlToShorten);

//button return url
//regular expression for http url
var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
var regex = expression;
if(regex.test(urlToShorten) ===true){
  var short = Math.floor(Math.random()*100000).toString();
  var data = new shortUrl(
    {
    originalUrl: urlToShorten,
    shorterUrl: short

  }
);
data.save(err=>{
  if(err){
    return res.send('Error saving to database');
  }

});
  return res.json(data)
}
var data = new shortUrl({
  orignalUrl: urlToShorten,
  shorterUrl: 'InvalidURL'
});
  return res.json(data);

});

//Query database and forward to originalUrl
app.get('/:urlToForward',(req, res , next)=>{
  var shorterUrl = req.params.urlToForward;

  shortUrl.findOne({'shorterUrl': shorterUrl}, (err, data)=>{
    if(err) {return res.send('Error reading database');}
    var reg = new RegExp("^(http|https)://","i");
    var strToCheck = data.originalUrl;
    if(reg.test(strToCheck)){
      res.redirect(301, data.originalUrl);
    }
    else {
      res.redirect(301, 'http://' + data.originalUrl);
    }
  });
});




//use ES6 ()=>
//process is for if on Heroku
 app.listen(process.env.PORT || 3000, ()=>{

    console.log("working");
 })
