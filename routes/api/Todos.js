const express = require('express');

const router = express.Router();

const mongo = require('mongodb');

const MongoClient = mongo.MongoClient;

const url = "mongodb://localhost:27017/";

const connection = MongoClient.connect(url);

const moment = require('moment');

router.use(express.json());

router.get('/:id?', (req, res) => {
    connection.then(db => {
        const dbo = db.db("tododb");

        if (req.params.id) {
            const id = new mongo.ObjectID(req.params.id);

            // Return specific todo
            dbo.collection('todos').findOne({ _id: id }, (err, result) => {
                if (err) {
                    res.status(400).send(err);
                } else {
                    res.json(result);
                }

                db.close();
            })

        } else {

            // Return All Todos
            dbo.collection('todos').find({}).toArray(function (err, result) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.json(result);
                }
                db.close();
            });
        }
    })
});

router.post('/', (req, res) => {

    // Add todo to db
    connection.then(db => {
        const dbo = db.db("tododb");

        if (!req.body.name) {
            res.status(400).send("You must submit a name");
        }

        const todoObj = {
            name: req.body.name,
            completed: req.body.completed || false,
            dateCreated: moment().format('MMMM Do YYYY, h:mm:ss a')
        }

        dbo.collection('todos').insertOne(todoObj, (err, todo) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.json(todo.ops);
            }
            db.close();
        });
    });
});

router.put('/:id', (req, res) => {

    // Update Specified Todo
    connection.then(db => {
        const dbo = db.db('tododb');

        const _id = new mongo.ObjectID(req.params.id);

        const query = { _id };

        const newTodo = { $set: { completed: req.body.completed } };

        dbo.collection('todos').updateOne(query, newTodo, (err, result) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.json(result);
            }
            db.close();
        });
    })
})
module.exports = router;