const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())

// raihanhossan02
// M9rTsLqV14Tp4R3r


const uri = "mongodb+srv://raihanhossan02:M9rTsLqV14Tp4R3r@cluster0.4zisw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
    await client.connect();

    const database = client.db("artCraftDB");
    const userCollection = database.collection("artCraft");
    const artCollection = client.db('artCraftDB').collection('addArtItem')

    
    // users server and mongodb side here
    app.post('/users', async(req, res) =>{
      const user = req.body
      const result = await userCollection.insertOne(user)
      res.send(result)
    })

    // artcraft server and mongodb side here
    app.post('/artitems', async(req, res) =>{
      const art = req.body
      const result = await artCollection.insertOne(art)
      res.send(result)
    })

    app.get('/artitems', async(req, res) =>{
      const cursor = artCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get('/artitems/:id', async(req, res) =>{
      const id = req.params.id
      const art = {_id : new ObjectId(id)}
      const result = await artCollection.findOne(art)
      res.send(result)
    })

    app.delete('/artitems/:id', async(req, res) =>{
      const id = req.params.id 
      const deleteArt = {_id : new ObjectId(id)}
      const result = await artCollection.deleteOne(deleteArt)
      res.send(result)
    })

    app.put('/artitems/:id', async(req, res) =>{
      const id = req.params.id 
      console.log('the id to update' ,id);
      const updatedBody  = req.body
      console.log(updatedBody);
      const filter = {_id : new ObjectId(id)}
      console.log('update me', filter);
      const options = { upsert : true}
      const updatedArt = {
        $set: {
          name : updatedBody.name,
          brand : updatedBody.brand,
          type : updatedBody.type,
          price : updatedBody.price,
          details : updatedBody.details,
          photo : updatedBody.photo
        }
      }
      const result = await artCollection.updateOne(filter, updatedArt, options)
      res.send(result)
    })
    
    




    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Jute and wooden craft is running')
})
app.listen(port, ()=>{
    console.log(`server is running ${port}`);
})