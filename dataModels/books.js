import { v4 as uuidv4 } from 'uuid';
import {model, Schema} from 'mongoose'

const bookModel = new Schema({
  countOfViews: {
    type: Number,
    default: 0
  },
  title: {
    type: String,
    required : true
  },
  description: {
    type: String,
    default : null
  },
  authors: {
    type: String,
    required : true
  },
  favorite: {
    type: Boolean,
    default : false
  },
  fileCover: {
    type: String,
    default : null
  },
  fileName: {
    type: String,
    default : null
  },
  fileBook: {
    type: String,
    default : null
  },
});

export default model('Books', bookModel)
