var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/* Schema defination */
var kittySchema = Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  age: Number,
  stories: [{ type: Schema.Types.ObjectId, ref: 'Story' }]
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

module.exports = mongoose.model('Kitten', kittySchema);

