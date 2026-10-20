import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
    description: { type: String, default: '' }
  },
  { timestamps: true }
);

export const Setting = mongoose.models.Setting || mongoose.model('Setting', settingSchema);
