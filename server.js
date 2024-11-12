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

app.post("/api/getUsersByIds", async (req, res) => {
  const { userIds } = req.body; // Expecting userIds to be an array of ObjectId strings

  let error = "";
  let users = [];

  try {
    const db = client.db("COP4331");
    const usersCollection = db.collection("Users");

    // Convert user IDs to ObjectId format
    const objectIds = userIds.map(id => new ObjectId(id));

    // Fetch users by their _id from the Users collection
    users = await usersCollection.find(
      { _id: { $in: objectIds } },
      { projection: { firstName: 1, lastName: 1 } } // Only retrieve firstName and lastName
    ).toArray();

  } catch (e) {
    error = e.toString();
  }

  const ret = { users: users, error: error };
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
        students: result.students,
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

//CLASS INFO STUDENT API
app.post("/api/classInfoStudent", async (req, res) => {
  const { classId, userId } = req.body;

  let error = "";
  
  try {
    //Connect to DB and retrieve classes and sessions
    const db = client.db("COP4331");
    const classesCollection = db.collection("Classes");
    const sessionsCollection = db.collection("Sessions");
    const usersCollection = db.collection("Users")


    //use class id to find document
    const classDocument = await classesCollection.findOne({ _id: new ObjectId(classId) });
    if (!classDocument) {
      return res.status(404).json({ error: "Class not found" });
    }

    //get teachers name
    const teacherID = classDocument.teacherID;
    const teacherUserDocument = await usersCollection.findOne({ _id: new ObjectId(teacherID) });
    if (!teacherUserDocument) {
      return res.status(404).json({ error: "Teacher not found" });
    }
    const teacherLastName = teacherUserDocument.lastName;
    
     //Get Latest session
     const latestSessionId = classDocument.sessions[classDocument.sessions.length - 1];
     if (!latestSessionId) {
       return res.status(404).json({ error: "No sessions found for this class" });
     }

    //Find the latest session document with the session ID
    const sessionDocument = await sessionsCollection.findOne({ _id: new ObjectId(latestSessionId) });
    if (!sessionDocument) {
      return res.status(404).json({ error: "Session not found" });
    }

    //Get The sessions details
    const { isRunning, startTime, endTime, students, signals} = sessionDocument; 

    //Get student attendance
    const studentSearch = students.find(s => s.userId.equals(new ObjectId(userId)));
    if (!studentSearch) {
      return res.status(404).json({ error: "Student not found in this session" });
    }
    const studentAttendanceNumber = studentSearch.attendanceNumber;
    const studentAttendanceGrade = studentSearch.attendanceGrade;

    // Respond with the required details
    res.json({
      teacherLastName,
      isRunning,
      startTime,
      endTime,
      studentAttendanceNumber,
      studentAttendanceGrade,
      signals
    });
  } catch (error) {
    console.error("Error fetching class info for student:", error);
    res.status(500).json({ error: "Internal server error" });
  }
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
  //Update: pass in students array from the class document into the session document
  const { uuid, startTime, endTime, signals = 0, isRunning = true, classId } = req.body;
  let error = "";
  let newSession = null;

  try {
    const db = client.db("COP4331");
    const sessionsCollection = db.collection("Sessions");
    const classesCollection = db.collection("Classes");

    //Grab class document and pass in user ids and set default values
    const classDocument = await classesCollection.findOne({_id: new ObjectId(classId)});
    if (!classDocument) {
      return res.status(404).json({error: "Class not found"});
    }

    const studentArray = classDocument.students.map(userId => ( {
      userId: userId,
      attendanceGrade: false,
      attendanceNumber: 0
    }));
    
    // Step 1: Create the session in the Sessions collection
    const sessionData = {
      uuid,                        // Unique session identifier
      startTime: new Date(startTime),  // Convert to Date object
      endTime: new Date(endTime),      // Convert to Date object
      signals,                     // Number of signals
      isRunning,                   // Boolean indicating if session is running
      students: studentArray, // Convert student IDs to ObjectIds
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


//End Session
app.post('/api/endSession', async (req, res) => {
  // Destructure input values from the request body
  const { sessionId, endTime } = req.body;

  // Check for required fields
  if (!sessionId || !endTime) {
    return res.status(400).json({ error: "sessionId and endTime is missing." });
  }

  try {
    // Connect to the database and set up the Sessions collection
    const db = client.db("COP4331");
    const sessionsCollection = db.collection("Sessions");

    // Update the session in the Sessions collection
    const result = await sessionsCollection.updateOne(
      { _id: new ObjectId(sessionId) },
      { $set: { endTime: new Date(endTime), isRunning: false } }
    );

    // Check if any document was modified
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Session not found" });
    }

    // Send a success response
    res.json({ message: "Session ended successfully" });

  } catch (error) {
    console.error("Error ending session:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Increment teacher signals
app.post("/api/incrementTeacherSignals", async (req, res) => {
  const { sessionId } = req.body;

  try {
    //Connect to Database and retrieve Sessions collection
    const db = client.db("COP4331");
    const sessionsCollection = db.collection("Sessions");

    //Increment the "signals" field by 1 for the specified session.
    //$inc increments by 1
    const result = await sessionsCollection.updateOne(
      { _id: new ObjectId(sessionId) },
      { $inc: { signals: 1 } }
    );

    // Check if the session was found and updated
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Session not found" });
    }

    res.json({ message: "Signals incremented successfully" });
  } catch (error) {
    console.error("Error incrementing signals:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//student scan
app.post("/api/studentScan", async (req, res) => {
  const { userId, sessionId, isPresent } = req.body;
  let error = "";
  try {
    //Connect to Database and retrieve Sessions collection
    const db = client.db("COP4331");
    const sessionsCollection = db.collection("Sessions");

    //Find the session document
    const session = await sessionsCollection.findOne({ _id: new ObjectId(sessionId) });

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    //Check if the session is currently running
    const { isRunning } = session;
    const { signals } = session;

    //if isPresent is true
      //increment attendanceNumber

    //return isRunning
    //message

    //Find the student in the session's student array and update attendance if isPresent is true
    const updatedStudentArray = session.students.map(students => {
      if (students.userId.equals(new ObjectId(userId))) {
        //if isPresent update attendance number
        if (isPresent) {
          students.attendanceNumber += 1; // Increment attendance if the student is marked as present
        
          //check if the increment hits the grade target
          if (students.attendanceNumber >= (signals - 1) ) {
            students.attendanceGrade = true; // Update the presence status
          }
          else {
            students.attendanceGrade = false;
          }
        
        }
      }
      return students; //Return updated student record
    });

    // Update the session document with the modified student array
    await sessionsCollection.updateOne(
      { _id: new ObjectId(sessionId) },
      { $set: { students: updatedStudentArray } }
    );

    // Respond with a success message and the current session's isRunning status
    res.json({
      error: "Student attendance updated successfully",
      isRunning: isRunning
    });

  } catch (error) {
    console.error("Error updating student attendance:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


//Get Session info
app.post("/api/getSessionInfo", async (req, res) => {
  const { sessionId } = req.body;
  let error = "";

  try {
    //Connect to Database and retrieve Sessions collection
    const db = client.db("COP4331");
    const sessionsCollection = db.collection("Sessions");

    //convert sessionId to objectId because a string is passed in
    const session = await sessionsCollection.findOne({ _id: new ObjectId(sessionId) });

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    const { signals } = session; // Get the signals value from the session document

    //Look through each student in the session's student array to update attendance. Map returns a new array of modified student objects.
    const updatedStudents = session.students.map(students => {

      if (students.attendanceNumber >= signals - 1) {
        students.attendanceGrade = true;
      }
      else {
        false;
      }
      return students;
    
    });

    //Update databse
    await sessionsCollection.updateOne(
      { _id: new ObjectId(sessionId) },
      { $set: { students: updatedStudents } }
    );

    //Respond with the modified session object
    res.json({
      ...session,
      students: updatedStudents
    });

  } catch (error) {
    console.error("Error fetching session info:", error);
    res.status(500).json({ error: "Internal server error" });
  }

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

        http://localhost:5173/resetpassword/${resetToken}

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
  const token = req.params.token;
  const { password } = req.body;

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
});

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
