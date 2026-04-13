import mongoose from 'mongoose';

const snippetSchema = new mongoose.Schema({
  title: { type: String, required: true }, // The Language Name (e.g. C++)
  code: { type: String, required: true },
  language: { type: String, required: true }, // The execution type
  color: { type: String, default: '#3b82f6' }, // UI Color for labels
  campus: { type: String, required: true },
  moderatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const Snippet = mongoose.model('Snippet', snippetSchema);

export default Snippet;
