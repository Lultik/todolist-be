import { Schema, model } from 'mongoose';

const schema = new Schema({
  todo: { type: String, required: true },
  isDeleted: { type: Boolean, default: false},
  DeletingDate: { type: Date, default: null },
})

module.exports = model('Todo', schema);
