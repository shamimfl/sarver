const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const cors = require('cors');
const jwt =require('jsonwebtoken');
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


function veryfyJWT (req, res, next){
    const authHeader = req.headers.authorization;
    if(!authHeader){
      return  res.status(401).send({message : 'unauthoraise access'} )
    }
    next()
}


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dsufg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


app.get('/', (req, res) => {
    res.send('connected data')
})

async function run() {
    await client.connect();
    const collection = client.db("test").collection("devices");

    try {
        app.post('/inventory', async (req, res) => {
            const newProduct = req.body;
            console.log(newProduct);
            const result = await collection.insertOne(newProduct);
            res.send(result);
        })

        app.get('/inventory', async (req, res) => {
            const quary = {}
            const cursor = collection.find(quary);
            const product = await cursor.toArray();
            res.send(product)
        })

        app.get('/inventory/:_id', async(req, res)=>{
            const _id =req.params._id;
            const query ={_id: ObjectId(_id)};
            const product = await collection.findOne(query);
            res.send(product)
        })
        app.delete('/inventory/:_id', async(req, res)=>{
            const _id =req.params._id;
            const quary ={_id:ObjectId(_id)};
            const result = await collection.deleteOne(quary);
            res.send(result);
        })
        app.put('/inventory/:_id', async(req, res)=>{
            const _id =req.params._id;
            const updaQuentity =req.body;
            const filter = {_id: ObjectId(_id)};
            const options = { upsert: true };
            const updateDoc ={
                $set :{
                    quentity : updaQuentity.quentity
                }
            };
            const result = await collection.updateOne(filter, updateDoc, options);
            res.send(result)
        })
        app.put('/inventory/:_id', async(req, res)=>{
            const _id =req.params._id;
            const updaQuentity =req.body;
            const filter = {_id: ObjectId(_id)};
            const options = { upsert: true };
            const updateDoc ={
                $set :{
                    quentity : updaQuentity.quentity
                }
            };
            const result = await collection.updateOne(filter, updateDoc, options);
            res.send(result)
            console.log(updaQuentity)
        })

        app.get('/myitem',veryfyJWT, async (req, res)=>{
            const email =req.query.email;
            const quary ={email: email}
            const cursor = collection.find(quary)
            const product = await cursor.toArray()
            res.send(product)
        })

        app.post('/login',(req, res)=>{
            const user =req.body;
            const accesssToken = jwt.sign(user,  process.env.ACCESS_TOKEN_SECRET,{
                expiresIn: "1d"
            })
            res.send({accesssToken});
        })

       
    }

    finally {

    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log('running is sarver')
})