//Test comment for auto deploy
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer"); //for email verification
const app = express();

require("dotenv").config();
const url = process.env.DATABASE_URL;
const MongoClient = require("mongodb").MongoClient;
const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

(async function () {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (e) {
    console.error(e);
  }
})();

app.use(cors());
app.use(bodyParser.json());

// Setup Nodemailer
const transporter = nodemailer.createTransport({
  service: "Gmail", // or your preferred email provider
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS, // your email password or app password
  },
});

//LOGIN API
app.post("/api/login", async (req, res) => {
  const { login, password } = req.body;

  let error = "";
  let user = null;

  try {
    const db = client.db("COP4331");
    const usersCollection = db.collection("Users");

    const results = await usersCollection.findOne({
      login: login,
      password: password,
    });

    if (results) {
      if (/*!*/results.verified) { 
        error = 'Your email is not verified. Please check your email and verify your account.';
      } else {
      //all user info in one variable
      user = {
        id: results._id,
        firstName: results.firstName,
        lastName: results.lastName,
        email: results.email,
        role: results.role,
        verified: results.verified,
      };
    }
    } else {
      error = "Invalid login credentials";
    }
  } catch (e) {
    error = e.toString();
  }
  
  const ret = { user: user, error: error };
  res.status(200).json(ret);
});

// GET CLASSES API
app.post("/api/classes", async (req, res) => {
  const { login } = req.body; 

  let error = "";
  let classes = [];

  try {
    const db = client.db("COP4331");
    const usersCollection = db.collection("Users");

    // Find user by login
    const results = await usersCollection.findOne({ login: login });

    if (results) {
      classes = results.classes || [];
    } else {
      error = "User not found";
    }
  } catch (e) {
    error = e.toString();
  }

  const ret = { classes: classes, error: error };
  res.status(200).json(ret);
});

//CREATE A CLASS
app.post("/api/createclass", async (req, res) => {
  const { className, joinCode, teacherID } = req.body;

  let error = "";
  let newClass = null;

  try {
    const db = client.db("COP4331");
    const classesCollection = db.collection("Classes");

    // Check if a class with the same joinCode already exists
    const existingClass = await classesCollection.findOne({ joinCode: joinCode });

    if (existingClass) {
      error = "A class with this join code already exists.";
    } else {
      newClass = {
        className: className,
        joinCode: joinCode,
        teacherID: teacherID,
        students: [],
        sessions: [],       
        interval: 15        
      };

      const result = await classesCollection.insertOne(newClass);

      // Update the new class object with the auto-generated _id
      newClass._id = result.insertedId;
    }
  } catch (e) {
    error = e.toString();
  }

  const ret = { newClass: newClass, error: error };
  res.status(200).json(ret);
});



const { ObjectId } = require("mongodb"); // If you want to use MongoDB's ObjectId for _id generation

//REGISTER API
app.post('/api/register', async (req, res) => {
  const { login, password, firstName, lastName, email, role} = req.body;

  let error = "";
  let success = false;

  try {
    const db = client.db("COP4331");
    //find the correct table
    const usersCollection = db.collection("Users");

    // Check if a user with the same email already exists
    const existingEmailUser = await usersCollection.findOne({ email: email });
    if (existingEmailUser) {
      if (existingEmailUser.verified) {
        // If email is registered and verified, send an error message
        return res.status(400).json({
          success: false,
          error:
            "This email is already registered and verified. Please log in.",
        });
      } else {
        // If email is registered but not verified, prompt to check email
        return res.status(400).json({
          success: false,
          error:
            "This email is already registered but not verified. Please check your email for the verification link.",
        });
      }
    }
    const existingUser = await usersCollection.findOne({ login: login });
    if (existingUser) {
      error = "User already exists";
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
        classes: [],
        emailVerified: false
      });

      success = result.acknowledged;

      // Generate a temporary token in the URL (no need to store it)
      const verificationLink = `http://localhost:3000/api/verify-email?email=${encodeURIComponent(
        email
      )}`;
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Verify your email",
        text: `Hello ${firstName}, please verify your email by clicking the following link: ${verificationLink}`,
        html: `<p>Hello ${firstName},</p><p>Please verify your email by clicking the link below:</p><a href="${verificationLink}">Verify Email</a>`,
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error("Error sending email:", err);
        } else {
          console.log("Verification email sent:", info.response);
        }
      });
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

/**
 * API's Needed
 *  - Search for teacher
 *  - Search for classes
 *  - Add a class to student classes array
 *  - Remove a class from students classes array
 *  
 */


// EMAIL VERIFICATION API
app.get("/api/verify-email", async (req, res) => {
  const { email } = req.query;
  let error = "";
  let success = false;

  try {
    const db = client.db("COP4331");
    const usersCollection = db.collection("Users");

    console.log("Attempting to verify email:", email);

    // Find and update the user document
    const result = await usersCollection.findOneAndUpdate(
      { email: email, verified: false },
      { $set: { verified: true } },
      { returnDocument: "after" }
    );

    console.log("findOneAndUpdate result:", result);

    // Set success to true if a document was updated, regardless of result

    console.log(result.verified);

    if (result.verified === true) {
      success = true;
      res.send("Email verified successfully. You can now log in.");
    } else {
      error = "Invalid or expired verification link, or user already verified.";
      res.send(error);
    }
  } catch (e) {
    error = "An error occurred: " + e.toString();
    console.error("Error in verification:", error);
    res.status(500).send(error);
  }

  console.log("Verification result:", { success, error });
});

//SEARCH API FOR CARDS       KEPT IN FOR MODELING FUTURE SEARCH API IF NEEDED
app.post("/api/searchcards", async (req, res) => {
  const { userId, search } = req.body;
  var _search = search.trim();
  var error = "";
  var _ret = [];

  try {
    const db = client.db("CardsLab"); // Make sure to replace with your actual database name
    //regex is a resular expression to match the beginning of the name field with value in search variable. The .* means any character after. The i makes case insensitive

    const results = await db
      .collection("Cards")
      .find({ Name: { $regex: _search + ".*", $options: "i" } })
      .toArray();

    for (var i = 0; i < results.length; i++) {
      _ret.push(results[i].Name);
    }
  } catch (e) {
    error = e.toString();
  }

  var ret = { results: _ret, error: error };
  res.status(200).json(ret); // Changed tsxon to json
});

app.listen(3000, '0.0.0.0', () => {
  console.log("Server running on port 3000");
});
