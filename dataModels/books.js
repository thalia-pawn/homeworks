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
    default : ''
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
    default : ''
  },
  fileName: {
    type: String,
    default : ''
  },
  fileBook: {
    type: String,
    default : ''
  },
});

export default model('Books', bookModel)
