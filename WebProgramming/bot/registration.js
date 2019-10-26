let express = require('express');
let app = express();
const crypto = require('crypto');
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({extended: true});
app.use(bodyParser.json())
const MongoClient = require("mongodb").MongoClient;
const mongoClient = new MongoClient("mongodb://localhost:27017/");

var cors = require('cors')
app.use(cors())

mongoClient.connect(async function(err, cur) {
  const db = cur.db("SupportDB");
  const collection = db.collection("client");
  app.get('/reg', urlencodedParser, async function (req, res) {
    let token, resDB;
    do{
      token = crypto.randomBytes(64).toString('hex');
      resDB = await collection.find({token:token}).toArray();
    } while (resDB === undefined)
    let ins = await collection.insert({'token':token});
      if (ins.result.n)
        res.send({
          'token':token
        });
  });

});

app.listen(4000);