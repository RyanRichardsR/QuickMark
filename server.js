//Test comment for auto deploy
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();



const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb+srv://RickL:<db_password>@cardslab.jz8eh.mongodb.net/';
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

(async function() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (e) {
    console.error(e);
  }
})();

app.use(cors());
app.use(bodyParser.json());




app.post('/api/login', async (req, res) => {
  const { login, password } = req.body;

  var error = '';
  var id = -1;
  var fn = '';
  var ln = '';

  try {
    const db = client.db('CardsLab'); // Make sure to replace with your actual database name
    const results = await db.collection('Users').find({ Login: login, Password: password }).toArray();

    if (results.length > 0) {
      id = results[0].UserId;
      fn = results[0].firstName;
      ln = results[0].lastName;
    }
  } catch (e) {
    error = e.toString();
  }

  var ret = { id: id, firstName: fn, lastName: ln, error: error };
  res.status(200).json(ret); // Changed tsxon to json
});



app.post('/api/addcard', async (req, res) => {
  const { userId, card } = req.body;
  const newCard = { Name: card, UserId: userId };
  var error = '';

  try {
    const db = client.db('CardsLab'); // Make sure to replace with your actual database name
    const result = await db.collection('Cards').insertOne(newCard);
  } catch (e) {
    error = e.toString();
  }

  //cardList.push(card);

  var ret = { error: error };
  res.status(200).json(ret); // Changed tsxon to json
});

app.post('/api/searchcards', async (req, res) => {
  const { userId, search } = req.body;
  var _search = search.trim();
  var error = '';
  var _ret = [];

  try {
    const db = client.db('CardsLab'); // Make sure to replace with your actual database name
    //regex is a resular expression to match the beginning of the name field with value in search variable. The .* means any character after. The i makes case insensitive

    const results = await db.collection('Cards').find({ "Name": { $regex: _search + '.*', $options: 'i' } }).toArray();

    for (var i = 0; i < results.length; i++) {
      _ret.push(results[i].Name);
    }
  } catch (e) {
    error = e.toString();
  }

  var ret = { results: _ret, error: error };
  res.status(200).json(ret); // Changed tsxon to json
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
