const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000; 



//middel ware 

app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hxbb8.mongodb.net/?appName=Cluster0`;



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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const assignmentCollection = client.db('assignmentDB').collection('assignment')

    app.get('/assignments' , async(req , res) =>{
      const cursor = assignmentCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    });

    app.get('/assignments/:id' , async (req , res ) => {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)};
      const result = await assignmentCollection.findOne(query);
      res.send(result);
    })


    app.post('/assignments' , async (req , res) => {
      const newAssignments = req.body
      console.log(newAssignments)
      const result = await assignmentCollection.insertOne(newAssignments);
      res.send(result)
    });

    app.delete('/assignments/:id' , async (req , res) =>{
      const id = req.params.id;
      const query = { _id : new ObjectId(id)};
      const result = await assignmentCollection.deleteOne(query);
      res.send(result)
    });

    

    app.put('/assignments/:id' , async(req , res) =>{
      const id = req.params.id;
      const filter = { _id : new ObjectId(id)};
      const options = { upsert : true};
      const updatedAssignment = req.body;
      const assignment ={
        $set: {
          title: updatedAssignment.title,
            description:updatedAssignment.description,
            marks: updatedAssignment.marks,
            thumbnail: updatedAssignment.thumbnail,
            difficulty: updatedAssignment.difficulty,
            dueDate: updatedAssignment.dueDate,
        }
      }
      const result = await assignmentCollection.updateOne(filter , assignment , options);
      res.send(result);
    })






    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
   // await client.close();
  }
}
run().catch(console.dir);


app.get('/' , (req , res) =>{
    res.send('Here the finds the api off studens assignment')
})

app.listen(port , () =>{
    console.log(`assignment server is running on PORT : ${port}`)
})