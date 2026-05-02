
import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  label: { type: String, required: true },
  type: {
    type: String,
    enum: ['short', 'paragraph', 'multiple_choice', 'checkboxes', 'dropdown', 'date', 'time', 'linear_scale'],
    required: true,
  },
  required: { type: Boolean, default: false },
  options: [{ type: String }], 
});

const FormSchema = new mongoose.Schema(
  {
    title: { type: String, default: 'Untitled form' },
    description: { type: String, default: '' },
    questions: [QuestionSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Form || mongoose.model('Form', FormSchema);