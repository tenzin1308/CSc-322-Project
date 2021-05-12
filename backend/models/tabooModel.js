import mongoose from 'mongoose';

const tabooSchema = new mongoose.Schema(
  {
    word: { type: String, required: true, unique: true }
  },
  {
    timestamps: true,
  }
);
const Taboo = mongoose.model('Taboo', tabooSchema);

export default Taboo;
