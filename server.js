//Test comment for auto deploy
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer"); //for email verification
const app = express();
const { ObjectId } = require("mongodb"); // If you want to use MongoDB's ObjectId for _id generation
const crypto = require("crypto-js");

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
      $or: [
        { login: login },
        { email: login },
      ],
      password: password,
    });

    if (results) {
      // if (!results.emailVerified) {
      // } else {
      //all user info in one variable
      user = {
        id: results._id,
        firstName: results.firstName,
        lastName: results.lastName,
        email: results.email,
        role: results.role,
        //Dina added this - needed for getting classes
        login: results.login,
        emailVerified: results.emailVerified,
      };
    } else {
      error = "Username or Password is incorrect";
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
    const classesCollection = db.collection("Classes");

    // Find user by login and get class IDs
    const user = await usersCollection.findOne({ login: login });
    if (user) {
      const classIds = user.classes || [];

      // Fetch class documents based on class IDs
      classes = await classesCollection
        .find({ _id: { $in: classIds } })
        .toArray();
    } else {
      error = "User not found";
    }
  } catch (e) {
    error = e.toString();
  }

  res.status(200).json({ classes: classes, error: error });
});

//CREATE A CLASS
app.post("/api/createClass", async (req, res) => {
  const { className, joinCode, teacherID } = req.body;

  let error = "";
  let newClass = null;

  try {
    const db = client.db("COP4331");
    const classesCollection = db.collection("Classes");
    const usersCollection = db.collection("Users");

    // Check if a class with the same joinCode already exists
    const existingClass = await classesCollection.findOne({
      joinCode: joinCode,
    });

    if (existingClass) {
      error = "A class with this join code already exists.";
    } else {
      newClass = {
        className: className,
        joinCode: joinCode,
        teacherID: new ObjectId(teacherID),
        students: [],
        sessions: [],
        interval: 15
      };

      const result = await classesCollection.insertOne(newClass);
      newClass._id = result.insertedId;
      //adding class to teachers classes array
      await usersCollection.updateOne(
        { _id: new ObjectId(teacherID) },
        { $push: { classes: newClass._id } }
      );
    }
  } catch (e) {
    error = e.toString();
  }

  const ret = { newClass: newClass, error: error };
  res.status(200).json(ret);
});


// JOIN CLASS API
app.post("/api/joinClass", async (req, res) => {
  const { studentObjectId, joinCode } = req.body;

  let error = "";
  let success = false;
  console.log("Received studentObjectId:", studentObjectId);
  console.log("Wrapped as a new object:", new ObjectId(studentObjectId));


  try {
    const db = client.db("COP4331");
    const classesCollection = db.collection("Classes");
    const usersCollection = db.collection("Users");

    // Find the class with the given joinCode
    const classToJoin = await classesCollection.findOne({ joinCode: joinCode });

    if (!classToJoin) {
      error = "Class with this join code does not exist.";
    } else {
      // Check if the student is already in the class
      if (
        classToJoin.students &&
        classToJoin.students.includes(new ObjectId(studentObjectId))
      ) {
        error = "Student is already enrolled in this class.";
      } else {
        // Add the student's _id to the students array in the class
        await classesCollection.updateOne(
          { joinCode: joinCode },
          { $push: { students: new ObjectId(studentObjectId) } }
        );

        // Add the className to the classes array in the user's document
        await usersCollection.updateOne(
          { _id: new ObjectId(studentObjectId) },
          { $push: { classes: classToJoin._id } }
        );

        success = true;
      }
    }
  } catch (e) {
    error = e.toString();
  }

  const ret = { success: success, error: error };
  res.status(200).json(ret);
});

//LEAVE CLASS
app.post("/api/leaveClass", async (req, res) => {
  const { studentObjectId, classObjectId } = req.body;

  let error = "";
  let success = false;

  try {
    const db = client.db("COP4331");
    const classesCollection = db.collection("Classes");
    const usersCollection = db.collection("Users");

    // Find the class with the given classId
    const classToLeave = await classesCollection.findOne({
      _id: classObjectId,
    });

    if (!classToLeave) {
      error = "Class with this _id does not exist";
    } else {
      console.log("Students in class:", classToLeave.students);
      console.log("Checking for student:", new ObjectId(studentObjectId));

      // Check if the student is enrolled in the class
      //This WAS the condition thats failing
      //Convert ObjectId values to strings for comparison
      //classToLeave.students contains ObjectId instances from database. studentObjectID is a new instance.
      //In JavaScript, two distinct object instances are not considered equal, even if their internal values are the same.
      const studentsStrArray = classToLeave.students.map((id) => id.toString()); // Convert all to strings
      const studentIdStr = studentObjectId.toString(); // Convert the student ID to string

      if (classToLeave.students && studentsStrArray.includes(studentIdStr)) {
        // Remove the student's _id from the students array in the class
        await classesCollection.updateOne(
          { _id: classObjectId },
          { $pull: { students: new ObjectId(studentObjectId) } }
        );

        // Remove the className from the classes array in the user's document
        await usersCollection.updateOne(
          { _id: new ObjectId(studentObjectId) },
          { $pull: { classes: classToLeave.className } }
        );

        success = true;
      } else {
        error = "Student is not enrolled in this class.";
      }
    }
  } catch (e) {
    error = e.toString();
  }

  const ret = { success: success, error: error };
  res.status(200).json(ret);
});

//CLASS INFO TEACHER API
app.post("/api/classInfoTeacher", async (req, res) => {
  const { _id } = req.body;

  let error = "";
  let classInfo = null;

  try {
    const db = client.db("COP4331");
    const classesCollection = db.collection("Classes");
    const sessionsCollection = db.collection("Sessions");

    // Find the class by _id
    const result = await classesCollection.findOne({ _id: new ObjectId(_id) });

    console.log("Class Id searched: ", result._id);

    if (result) {
      // Log the class sessions for debugging
      console.log("Class sessions from database:", result.sessions);

      // Convert each session ID to an ObjectId and store in an array
      const sessionIds = result.sessions.map(id => new ObjectId(id));
      console.log("Converted session IDs for query:", sessionIds);

      // Retrieve only session documents matching these specific ObjectIds
      const sessionDetails = await sessionsCollection
        .find({ _id: { $in: sessionIds } })
        .toArray();

      // Log the retrieved sessions for debugging
      console.log("Retrieved sessions:", sessionDetails);

      // Build the class info object with the relevant session data
      classInfo = {
        interval: result.interval,
        joinCode: result.joinCode,
        className: result.className,
        sessions: sessionDetails.map(session => ({
          _id: session._id,
          ...session
        })),
      };
    } else {
      error = "Class not found";
    }
  } catch (e) {
    error = e.toString();
  }

  const ret = { classInfo: classInfo, error: error };
  res.status(200).json(ret);
});



//REGISTER API
app.post("/api/register", async (req, res) => {
  const { login, password, firstName, lastName, email, role } = req.body;

  let error = "";
  let success = false;

  try {
    const db = client.db("COP4331");
    //find the correct table
    const usersCollection = db.collection("Users");

    // Check if a user with the same email already exists
    const existingEmailUser = await usersCollection.findOne({ email: email });
    if (existingEmailUser) {
      if (existingEmailUser.emailVerified) {
        // If email is registered and verified, send an error message
        return res.status(200).json({
          success: false,
          error:
            "This email is already registered and verified. Please log in.",
        });
      } else {
        // If email is registered but not verified, prompt to check email
        return res.status(200).json({
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
        emailVerified: false,
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

//CREATE SESSION
app.post("/api/createSession", async (req, res) => {
  const { uuid, startTime, endTime, signals = 0, isRunning = false, student = [], classId } = req.body;
  let error = "";
  let newSession = null;

  try {
    const db = client.db("COP4331");
    const sessionsCollection = db.collection("Sessions");
    const classesCollection = db.collection("Classes");

    // Step 1: Create the session in the Sessions collection
    const sessionData = {
      uuid,                        // Unique session identifier
      startTime: new Date(startTime),  // Convert to Date object
      endTime: new Date(endTime),      // Convert to Date object
      signals,                     // Number of signals
      isRunning,                   // Boolean indicating if session is running
      student: student.map(id => new ObjectId(id)), // Convert student IDs to ObjectIds
    };

    const result = await sessionsCollection.insertOne(sessionData);

    if (result.acknowledged) {
      newSession = { ...sessionData, _id: result.insertedId };

      // Step 2: Update the specified class document to include the new session's _id
      const updateResult = await classesCollection.updateOne(
        { _id: new ObjectId(classId) },                  // Filter to find the correct class
        { $push: { sessions: result.insertedId } }       // Add the session _id to the sessions array
      );

      if (!updateResult.matchedCount) {
        error = "Class not found or could not be updated";
      }
    } else {
      error = "Failed to create session";
    }
  } catch (e) {
    error = e.toString();
  }

  // Return the created session data or an error
  res.status(error ? 500 : 201).json({ newSession, error });
});



app.delete("/api/deleteUser", async (req, res) => {
  const { login } = req.body; // Assuming the unique identifier is the 'login' field in the request body

  let error = "";
  let success = false;

  try {
    const db = client.db("COP4331");
    const usersCollection = db.collection("Users");

    // Delete user by login
    const result = await usersCollection.deleteOne({ login: login });

    if (result.deletedCount === 1) {
      success = true;
    } else {
      error = "User not found or could not be deleted";
    }
  } catch (e) {
    error = e.toString();
  }

  const ret = { success: success, error: error };
  res.status(200).json(ret);
});

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
      { email: email, emailVerified: false },
      { $set: { emailVerified: true } },
      { returnDocument: "after" }
    );

    console.log("findOneAndUpdate result:", result);

    // Set success to true if a document was updated, regardless of result

    console.log(result.emailVerified);

    if (result.emailVerified === true) {
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

//Forgot Password
app.post("/api/forgotPassword", async (req, res) =>  {
  const { email } = req.body;

  let error = "";
  let success = false;

  try {
    const db = client.db("COP4331");
    const usersCollection = db.collection("Users");
    
    const result = await usersCollection.findOne({ email: email });

    if (result) {
      const resetToken = crypto.lib.WordArray.random(16).toString(); //random Token generator
      const resetTokenExpiration = Date.now() + 3600000; // 1 hour from now

      //adds two variables to the database for password reset verification
      await usersCollection.updateOne(
        { email: email },
        {
          $set: {
            resetToken: resetToken,
            resetTokenExpiration: resetTokenExpiration,
          }
        }
      );

      success = result.acknowledged;

      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'QuickMark Password Reset',
        text: `
        You are receiving this because you (or someone else) have requested the reset of the password for your account.

        Please click on the following link, or paste this into your browser to complete the process:

        http://localhost:3000/resetpassword/${resetToken}

        If you did not request this, please ignore this email and your password will remain unchanged.
        `
      }

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error("Error sending email:", err);
          error = "Error sending email";
        } else {
          success = true;
          console.log("Password reset email sent:", info.response);
        }
      });
    } else {
      error = "Email not found"
    }
  } catch (e) {
    error = e.toString();
  }
  
  const ret = { success: success, error: error };
  res.status(200).json(ret);
});

//Reset Password
app.post('/api/resetPassword/:token', async (req, res) => {
  const { token, password } = req.body;

  let error = "";
  let success = false;

  try {
    const db = client.db("COP4331");
    const usersCollection = db.collection("Users");

    const result = await usersCollection.findOne({ 
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() }, //ensure token is not expired
    });

    if(result) {
      await usersCollection.updateOne(
        { resetToken: token },
        {
          $set: {
            password: password,
          },
          $unset: {
            resetToken: "", resetTokenExpiration: "",
          }
        }
      );
    } else {
      error = "Invalid or Expired token"
    }
  } catch (e) {
    error = e.toString();
  }

  const ret = { success: success, error: error };
  res.status(200).json(ret);
})

//SEARCH API FOR CARDS KEPT IN FOR MODELING FUTURE SEARCH API IF NEEDED
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

app.listen(3000, "0.0.0.0", () => {
  console.log("Server running on port 3000");
});
