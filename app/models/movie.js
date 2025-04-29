const mongoose = require('mongoose')

const MovieSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: String,
  status: String,
  director: String,
  year: String,
  rating: String, //will change this to stars later somehow
  review: String,
})

module.exports = mongoose.model('Movie', MovieSchema)