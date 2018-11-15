var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/* Schema defination */
var storySchema = Schema({
  author: { type: Schema.Types.ObjectId, ref: 'Kitten' },
  title: String,
  fans: [{ type: Schema.Types.ObjectId, ref: 'Kitten' }]
});

module.exports = mongoose.model('Story', storySchema);
