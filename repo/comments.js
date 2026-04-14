import Comments from '../dataModels/comments.js';

async function getBookComments(bookId) {
  return await Comments.find({bookId: bookId});
};

async function addComment(payload) {
  return await Comments.insertOne(payload)
}

async function updateComment(id, dataToUpdate) {
  return await Comments.updateOne({_id: id}, dataToUpdate)
}

export {
  getBookComments,
  addComment,
  updateComment
}