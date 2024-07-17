const express =require('express')
const app = express();
const cors = require("cors");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 8000;
// middleWare
const corsOptions = {
    origin: [
      "http://localhost:5173",
    ],
    credentials: true,
    optionSuccessStatus: 200,
  };
  app.use(cors(corsOptions));
  app.use(express.json());

  const secretKey  =
  "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jbkj?[]]pou89ywe";

  

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.po42dna.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    
    const usersCollection = client.db("Mobile_Financial").collection("user");

   // jwt related api
   app.post("/jwt", async (req, res) => {
    const user = req.body;
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "365d",
    });
    res.send({ token });
  });

  // middleWere
  const verifyToken = (req, res, next) => {
    console.log(req.headers.authorization);
    if (!req.headers.authorization) {
      return res.status(401).send({ message: "Unauthorized access" });
    }
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: "Unauthorized access" });
      }
      req.decoded = decoded;
      next();
    });
    // next()
  };

// user relate api 
  // app.post("/users", async (req, res) => {
  //   const user = req.body;
  //   const query = { email: user.email };
  //   const exitingUser = await usersCollection.findOne(query);
  //   if (exitingUser) {
  //     return res.send({ message: "user already exits", insertedId: null });
  //   }
  //   const result = await usersCollection.insertOne(user);
  //   res.send(result);
  // });

  // Registration Endpoint
app.post('/register', async (req, res) => {
  try {
    const { name, pin, mobileNumber, email } = req.body;
    if (!name || !pin || !mobileNumber || !email) {
      return res.status(400).send('All fields are required');
    }

    if (!/^\d{5}$/.test(pin)) {
      return res.status(400).send('PIN must be a 5-digit number');
    }

    const hashedPin = await bcrypt.hash(pin, 10);
    const user = {
      name,
      pin: hashedPin,
      mobileNumber,
      email,
      status: 'pending',
      balance: 0
    };

    const result = await usersCollection.insertOne(user);
    res.status(201).send({ message: 'User registered successfully', userId: result.insertedId });
  } catch (error) {
    res.status(500).send('Error registering user');
  }
});


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
   
  }
}
run().catch(console.dir);


  app.get("/", (req, res) => {
    res.send("Server is running");
  });
  app.listen(port, () => {
    console.log(`Mobile Financial Server is running${port}`);
  });