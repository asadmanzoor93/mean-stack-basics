const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

mongoose.connect('mongodb://localhost/test_collectoion');

var kittySchema = new mongoose.Schema({
  name: String
});

kittySchema.statics.findAllRecords = function(id) {
  return this.find({});
};

kittySchema.statics.findRecord = function(id) {
  return this.find({ _id : id });
};

kittySchema.statics.findByName = function(name) {
  this.find({ 
      name: new RegExp(name, 'i') 
  });
}

var Kitten = mongoose.model('Kitten', kittySchema);

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

// router.param('id', function(req, res, next) {
//   console.log('id : ' + req.params);
//   Kitten.find(req.params.id, function(err, kitten) {
//     if (err) {
//       next(err);
//     } else if (kitten) {
//       console.log('Kitten' + kitten);

//       req.kitten = kitten;
//       next();
//     } else {
//       next(new Error('failed to load record'));
//     }
//   });
// });

router.param('id', function(req, res, next, id) {
  console.log('router.param called !');
  req.kitten = Kitten.findRecord(id).exec();
  next();
});

router.get('/kittens/admin', function(req, res, next) {
  Kitten.findAllRecords()
    .exec()
    .then((kittens) => {
        var kittensMap={}; 
        kittens.forEach((kitten) => { 
          kittensMap[kitten._id] = kitten.name; 
        });
        res.render('admin_index', { 
          title: 'CRUD Application',
          kittens : kittensMap 
        });
    })
    .catch((err) =>{
      console.log("Error:", err);
    });
});

router.get('/kittens/create', function(req, res, next) {
  res.render('create');
});

router.put('/kittens/:id', function(req, res, next) {
  Kitten.findByIdAndUpdate(req.params.id, 
      { $set: { name: req.body.name } }, 
      { new: true }
    )
    .exec()
    .then((record) => {
      res.redirect('/kittens/admin');
    })
    .catch((err) => {
      console.log("Error:", err);
    });
});

router.post('/kittens', function(req, res, next) {
  var record = new Kitten({ name: req.body.name });
  record.save() // returns promise
    .then((result) => {
      res.redirect('/kittens/admin');
    })
    .catch((err) => {
      console.log("Error:", err);
    });
});

router.get('/kittens/:id', function(req, res, next) {
  var kittenObj = '';
  if(req.kitten != '' && req.kitten != undefined){
    console.log('Using router.param functionality !')
    kittenObj = req.kitten;
  }else{
    kittenObj = Kitten.findRecord(req.params.id).exec();
  }

  if(kittenObj != '' && kittenObj != undefined) {
    kittenObj
    .then((kitten) => {
        res.render('edit',{ id : kitten[0]._id , title : kitten[0].name });
      })
      .catch((err) => {
        console.log("Error:", err);
      });
  }
});

router.delete('/kittens/:id', function(req, res, next) {
  Kitten.findByIdAndRemove(req.params.id)
    .exec()
    .then((output) => {
      res.send('success');
    })
    .catch((err) => {
      console.log("Error:", err);
    });
});

module.exports = router;
