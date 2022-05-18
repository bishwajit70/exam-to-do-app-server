const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const cors = require('cors');
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000


// middleware 
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello to-do-app!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.agdl8.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

async function run() {
    try {
        await client.connect();
        console.log('Database Connected')
        const taskCollection = client.db('todoapp_portal').collection('tasks');

        app.get('/tasks', async (req, res) => {
            const query = {}
            const cursor = taskCollection.find(query)
            const tasks = await cursor.toArray()
            res.send(tasks)
        })

        app.post('/tasks', async (req, res) => {
            const tasks = req.body;
            const result = await taskCollection.insertOne(tasks);
            console.log(result);
            res.send(result)
        })

        app.delete('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await taskCollection.deleteOne(query);
            res.send(result);
        })

        app.get('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await taskCollection.findOne(query)
            res.send(result);
        })


    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);
















app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})