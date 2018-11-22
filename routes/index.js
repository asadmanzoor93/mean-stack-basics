const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

mongoose.connect('mongodb://localhost/test_collectoion');

var Kitten = require("../models/kitten");
var Story = require("../models/story");

router.param('id', function(req, res, next, id) {
  Kitten.findRecord(id).then(record => {
    req.kitten = record;
    next();
  })
  .catch(err => {
    console.log("Error:", err);
  });
});

router.param('story_id', function(req, res, next, id) {
  Story.findRecord(id).then(record => {
    req.story = record;
    next();
  })
  .catch(err => {
    console.log("Error:", err);
  });
});

/* Kitten Model Routes */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/admin/listing', function(req, res, next) {
  Kitten.findAllRecords()
   .then(kittens => {
     let kittensMap = []; 
     kittens.forEach((kitten) => {
       kittensMap.push(kitten); 
     });

     storiesMap = [];
     Story.find({}).populate({ path : 'author', select : 'name' }).exec().then((stories) => {
       stories.forEach((story) => {
        storiesMap.push(story); 
       });

       res.render('admin_index', { 
        title: 'CRUD Application',
        kittens : kittensMap,
        stories : storiesMap
       });
     });
   })
   .catch(err =>{
     console.log("Error:", err);
   });
});

router.get('/kittens/create', function(req, res, next) {
  res.render('kitten/create');
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
     res.redirect('/admin/listing');
   })
   .catch(err => {
     console.log("Error:", err);
   });
});

router.post('/kittens', function(req, res, next) {
  let record = new Kitten({ 
    _id : new mongoose.Types.ObjectId(),
    name: req.body.name,
    age : req.body.age
   });
  record.save() // returns promise
   .then(kitten => {
    var story1 = new Story({
      title: 'Story of '+req.body.name,
      author: kitten._id   
    });
  
    story1.save()
     .then(result => {
     })
     .catch(err => {
       console.log("Errors :", err);
     });

     record.stories.push(story1);
     record.save(); 
     res.redirect('/admin/listing');
   })
   .catch(err => {
     console.log("Errors :", err);
     if (err.errors){
      res.render('kitten/create',{
        errors : err.errors
      });
     }
   });
});

router.get('/kittens/:id', function(req, res, next) {
  res.render('kitten/edit',{ 
    id : req.kitten._id, 
    title : req.kitten.name, 
    age : req.kitten.age,
    full_information : req.kitten.full_information
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

/** Story CRUD */
router.get('/story/create', function(req, res, next) {
  res.render('story/create_story');
});

router.post('/story', function(req, res, next) {
  let record = new Story({ 
    title: req.body.title
   });
  record.save() // returns promise
   .then(() => {
     res.redirect('/admin/listing');
   })
   .catch(err => {

     console.log("Error:", err);
   });
});

router.get('/story/:story_id', function(req, res, next) {
  res.render('story/edit_story',{ 
    id : req.story._id, 
    title : req.story.title
  });
});

router.put('/story/:story_id', function(req, res, next) {
  Story.findByIdAndUpdate(
    req.params.story_id, 
    { $set: { 
      title: req.body.title
     } 
    }, 
    { new: true }
  )
   .exec()
   .then(() => {
     res.redirect('/admin/listing');
   })
   .catch(err => {
     console.log("Error:", err);
   });
});

router.delete('/story/:story_id', function(req, res, next) {
  Story.findByIdAndRemove(req.params.story_id)
   .exec()
   .then(() => {
     res.send('success');
   })
   .catch(err => {
     console.log("Error:", err);
   });
});

module.exports = router;