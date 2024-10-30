//Test comment for auto deploy
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

require('dotenv').config();
const url = process.env.DATABASE_URL;

const MongoClient = require('mongodb').MongoClient
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

//LOGIN API
app.post('/api/login', async (req, res) => {
  const { login, password } = req.body;

  let error = '';
  let user = null;

  try {
    const db = client.db('COP4331');
    const usersCollection = db.collection('Users');

    const results = await usersCollection.findOne({ login: login, password: password });

    if (results) {
      //all user info in one variable
      user = {
        id: results._id,
        firstName: results.firstName,
        lastName: results.lastName,
        email: results.email,
        role: results.role,
        verified: results.verified
      };
    } else {
      error = 'Invalid login credentials';
    }
  } catch (e) {
    error = e.toString();
  }

  const ret = { user: user, error: error };
  res.status(200).json(ret);
});



const { ObjectId } = require('mongodb'); // If you want to use MongoDB's ObjectId for _id generation

//REGISTER API
app.post('/api/register', async (req, res) => {
  const { login, password, firstName, lastName, email, role, verified } = req.body;

  let error = '';
  let success = false;

  try {
    const db = client.db('COP4331');
    //find the correct table
    const usersCollection = db.collection('Users');

    const existingUser = await usersCollection.findOne({ login: login });
    if (existingUser) {
      error = 'User already exists';
    } else {
      // Generate a custom or default _id
      const userId = new ObjectId();

      //NEWLY INSERTED INFO
      const result = await usersCollection.insertOne({
        _id: userId,
        login: login,
        password: password,
        firstName: firstName,
        lastName: lastName,
        email: email,
        role: role,
        emailVerified: verified
      });

      success = result.acknowledged;
    }
  } catch (e) {
    error = e.toString();
  }

  const ret = { success: success, error: error };
  res.status(200).json(ret);
});

app.delete('/api/deleteUser', async (req, res) => {
  const { login } = req.body; // Assuming the unique identifier is the 'login' field in the request body

  let error = '';
  let success = false;

  try {
    const db = client.db('COP4331');
    const usersCollection = db.collection('Users');

    // Delete user by login
    const result = await usersCollection.deleteOne({ login: login });

    if (result.deletedCount === 1) {
      success = true;
    } else {
      error = 'User not found or could not be deleted';
    }
  } catch (e) {
    error = e.toString();
  }

  const ret = { success: success, error: error };
  res.status(200).json(ret);
});



//SEARCH API FOR CARDS       KEPT IN FOR MODELING FUTURE SEARCH API IF NEEDED
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
