// load Express.js
const express = require('express')
const app = express()
const cors = require('cors')
// parse the request parameters
app.use(cors())
app.use(express.json())
app.use(function (req, res, next) {
    console.log("Request IP: " + req.url);
    console.log("Request date: " + newDate());
});

var path = require("path");
var staticPath = path.resolve(__dirname, "public");
app.use(express.static(staticPath));


// connect to MongoDB
let db;
const MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb+srv://JE451:Deacon34@cluster-lesson.8cspb.mongodb.net/', (err, client) => {
    if (err) {
        console.log("db mondodb error ", err)
        return
    }
    else {
        db = client.db('app')
    }
})
// get the collection name
app.param('collectionName', (req, res, next, collectionName) => {
    req.collection = db.collection(collectionName)
    return next()
})
// dispaly a message for root path to show that API is working
app.get('/', function (req, res) {
    res.send('welcome to mongodb server')
})
// retrieve all the objects from an collection
app.get('/collection/:collectionName', (req, res) => {
    req.collection.find({}).toArray((e, results) => {
        if (e) return next(e)
        res.send(results)
    })
})
// add an object
app.post('/collection/:collectionName', (req, res, next) => {
    req.collection.insert(req.body, (e, results) => {
        if (e) return next(e)
        res.send(results.ops)
    })
})
//update an object
app.put('/collection/:collectionName', (req, res, next) => {
    req.collection.insert(req.body, (e, results) => {
        if (e) return next(e)
        res.send(results.ops)
    })
})
// retrieve an object by mongodb ID
const ObjectId = require('mongodb').ObjectId;
app.get('/collection/:collectionName/:id', (req, res, next) => {
    req.collection.findOne({ _id: new ObjectId(req.params.id) }, (e, result) => {
        if (e) return next(e)
        res.send(result)
    })
})
const port = process.env.PORT || 3000
app.listen(port)
