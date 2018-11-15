const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

mongoose.connect('mongodb://localhost/test_collectoion');

var Kitten = require("../models/kitten");
var Story = require("../models/story");

/* Kitten Model Routes */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.param('id', function(req, res, next, id) {
  Kitten.findRecord(id).then(record => {
    req.kitten = record;
    next();
  })
  .catch(err => {
    console.log("Error:", err);
  });
});

router.get('/kittens/admin', function(req, res, next) {
  Kitten.findAllRecords()
   .then(kittens => {
     let kittensMap = []; 
     kittens.forEach((kitten) => {
       kittensMap.push(kitten); 
     });
     res.render('admin_index', { 
       title: 'CRUD Application',
       kittens : kittensMap 
     });
   })
   .catch(err =>{
     console.log("Error:", err);
   });
});

router.get('/kittens/create', function(req, res, next) {
  res.render('create');
});

router.put('/kittens/:id', function(req, res, next) {
  Kitten.findByIdAndUpdate(
    req.params.id, 
    { $set: { 
      name: req.body.name,
      age : req.body.age
     } 
    }, 
    { new: true }
  )
   .exec()
   .then(() => {
     res.redirect('/kittens/admin');
   })
   .catch(err => {
     console.log("Error:", err);
   });
});

router.post('/kittens', function(req, res, next) {
  let record = new Kitten({ 
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    age : req.body.age
   });
  record.save() // returns promise
   .then(() => {
     res.redirect('/kittens/admin');
   })
   .catch(err => {
     console.log("Error:", err);
   });
});

router.get('/kittens/:id', function(req, res, next) {
  res.render('edit',{ 
    id : req.kitten._id, 
    title : req.kitten.name, 
    age : req.kitten.age
  });
});

router.delete('/kittens/:id', function(req, res, next) {
  Kitten.findByIdAndRemove(req.params.id)
   .exec()
   .then(() => {
     res.send('success');
   })
   .catch(err => {
     console.log("Error:", err);
   });
});

module.exports = router;