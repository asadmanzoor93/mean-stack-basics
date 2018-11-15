const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

mongoose.connect('mongodb://localhost/test_collectoion');

/* Schema defination */
var kittySchema = new mongoose.Schema({
  name: String
});

kittySchema.statics.findAllRecords = function(id) {
  return this.find({}).exec();
};

kittySchema.statics.findRecord = function(id) {
  return this.findById(id).exec();
};

kittySchema.statics.findByName = function(name) {
  return this.findOne({ name: new RegExp(name, 'i') });
};

var Kitten = mongoose.model('Kitten', kittySchema);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.param('id', function(req, res, next, id) {
  req.kitten = Kitten.findRecord(id);
  next();
});

router.get('/kittens/admin', function(req, res, next) {
  Kitten.findAllRecords()
   .then( kittens => {
     let kittensMap = {}; 
     kittens.forEach((kitten) => { 
       kittensMap[kitten._id] = kitten.name; 
     });
     res.render('admin_index', { 
       title: 'CRUD Application',
       kittens : kittensMap 
     });
   })
   .catch( err =>{
     console.log("Error:", err);
   });
});

router.get('/kittens/create', function(req, res, next) {
  res.render('create');
});

router.put('/kittens/:id', function(req, res, next) {
  Kitten.findByIdAndUpdate(
    req.params.id, 
    { $set: { name: req.body.name } }, 
    { new: true }
  )
   .exec()
   .then( record => {
     res.redirect('/kittens/admin');
   })
   .catch( err => {
     console.log("Error:", err);
   });
});

router.post('/kittens', function(req, res, next) {
  let record = new Kitten({ name: req.body.name });
  record.save() // returns promise
   .then( result => {
     res.redirect('/kittens/admin');
   })
   .catch( err => {
     console.log("Error:", err);
   });
});

router.get('/kittens/:id', function(req, res, next) {
  let kittenObj;
  if (req.kitten) {
    kittenObj = req.kitten;
  } else {
    kittenObj = Kitten.findRecord(req.params.id);
  }

  if (kittenObj) {
    kittenObj.then( kitten => {
      console.log(kitten);
      res.render('edit',{ id : kitten._id , title : kitten.name });
    })
    .catch( err => {
      console.log("Error:", err);
    });
  }
});

router.delete('/kittens/:id', function(req, res, next) {
  Kitten.findByIdAndRemove(req.params.id)
   .exec()
   .then( output => {
     res.send('success');
   })
   .catch( err => {
     console.log("Error:", err);
   });
});

module.exports = router;