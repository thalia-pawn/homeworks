import {model, Schema} from 'mongoose'

const commentModel = new Schema({
  login: {
    type: String,
    required : true
  },
  text: {
    type: String,
    required : true
  },
  bookId: {
    type: String,
    required : true
  }
}, {
  timestamps: true,
});

export default model('Comment', commentModel)
