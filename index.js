const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


//middleware area here--------------------------------------------------------------------

app.use(cors());
app.use(express.json());


//URI Connection--------------------------------------------------------------------------

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.klglhlk.mongodb.net/?retryWrites=true&w=majority`

// Create a MongoClient with a MongoClientOptions object to set the Stable API version-----
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
    // await client.connect();
    

    const productCollection = client.db('Category').collection('products');
    
    //Get single data here.................................................................
    app.get('/products', async (req, res)=>{
        console.log(req.query.email);
        let query = {};
        if(req.query?.email){
            query = { email: req.query.email}
        }
        const result = await productCollection.find(query).toArray();
        res.send(result)
    })
    
    //Post Data Here ....................................................................... 
    app.post('/products',async(req, res) =>{
        const product = req.body;
        console.log(product);
        
    //insert area data here..................................................................
        const result = await productCollection.insertOne(product);
        res.send(result )

    })
    // Patch Area here ......................................................................
    app.patch('/products/:id', async(req, res)=>{
        const updatedProduct = req.body;
        console.log(updatedProduct);

    })

    //delete from ui data area here..........................................................
    app.delete('/products/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await productCollection.deleteOne(query);
        res.send(result)
    })
    
    //Getting Data Here ....................................................................
    app.get('/products', async(req, res)=>{
            const cursor = productCollection.find();
            const result = await cursor.toArray();
            res.send(result);
    })

    // Send a ping to confirm a successful connection.......................................
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/',(req, res)=>{
    res.send('Toy is Running')
})
app.listen(port, ()=>{
    console.log('Toy Server is Running',port);
});
