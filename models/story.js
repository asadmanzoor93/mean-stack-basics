var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/* Schema defination */
var storySchema = Schema({
  author: { type: Schema.Types.ObjectId, ref: 'Kitten' },
  title: String,
  fans: [{ type: Schema.Types.ObjectId, ref: 'Kitten' }]
});

storySchema.statics.findAllRecords = function(id) {
  return this.find({}).exec();
};

storySchema.statics.findRecord = function(id) {
  return this.findById(id).exec();
};

storySchema.statics.findByName = function(name) {
  return this.findOne({ name: new RegExp(name, 'i') });
};

module.exports = mongoose.model('Story', storySchema);
