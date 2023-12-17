import mongoose from "mongoose";

const Schema = mongoose.Schema;

const postLikeUnlikeSchema = new Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  post: {
    type: mongoose.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  liked: {
    type: Boolean,
    default: true,
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export default mongoose.model("LikeUnlikePost", postLikeUnlikeSchema);
