import { Schema, model } from 'mongoose';

const pendingDonorSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export default model('PendingDonor', pendingDonorSchema);
