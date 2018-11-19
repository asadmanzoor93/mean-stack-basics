var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/* Schema defination */
var kittySchema = Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  age: { type: Number, min: 1, max: 10 },
  stories: [{ type: Schema.Types.ObjectId, ref: 'Story' }]
});

kittySchema.virtual('full_information').get(function() {  
  return this.name + ' - ' + this.age;
});

kittySchema.statics.findAllRecords = function(id) {
  return this.find({}).populate({ path : 'stories', select : 'title' }).exec();
};

kittySchema.statics.findRecord = function(id) {
  return this.findById(id).exec();
};

kittySchema.statics.findByName = function(name) {
  return this.findOne({ name: new RegExp(name, 'i') });
};

module.exports = mongoose.model('Kitten', kittySchema);

