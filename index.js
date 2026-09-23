const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const db = client.db("ticketoDb");

const organizationCollection = db.collection("organizations");
const eventsCollection = db.collection("events");
const bookingCollection = db.collection("bookings");
const paymentsCollection = db.collection("payments");


// MongoDB connection
async function run() {
  try {
    await client.db("admin").command({ ping: 1 });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

run();


//get organization api 


app.get('/api/organization/:email',async(req,res)=>{
    const {email} = req.params;
    const result = await organizationCollection.findOne({organizerEmail:email});

    res.send(result)
});


//add organization api
app.post("/api/organizations", async (req, res) => {
  try {
    const {
      organizationName,
      logo,
      website,
      description,
      organizerEmail,
    } = req.body;

    const addData = {
      organizationName,
      logo,
      website,
      description,
      organizerEmail,
      createdAt: new Date(),
      status: "active",
    };

    const result = await organizationCollection.insertOne(addData);

    res.send(result);

  } catch (error) {
    console.error("Organization insert error:", error);

    res.status(500).send({
      success: false,
      message: "Failed to add organization",
      error: error.message,
    });
  }
});


app.get("/", (req, res) => {
  res.send("server is running");
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});