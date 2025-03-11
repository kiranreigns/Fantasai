import mongoose from "mongoose";
const PostSchema = new mongoose.Schema({
  name: { type: String, required: true },
  prompt: { type: String, required: true },
  photo: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Post = mongoose.model("Post", PostSchema);

export default Post;
