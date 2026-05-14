import mongoose from 'mongoose';

const AnswerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
  value: { type: mongoose.Schema.Types.Mixed, required: false },
});

const ResponseSchema = new mongoose.Schema(
  {
    formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
    answers: [AnswerSchema],
    respondent: {
      userId: { type: String, required: true },
      name:   { type: String },
      email:  { type: String },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Response || mongoose.model('Response', ResponseSchema);