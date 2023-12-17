import mongoose from "mongoose";

const Schema = mongoose.Schema;
const commentSchema = new Schema({
    comment: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
      },
    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
    },
    
  });
  

const postSchema = new Schema({
    title: {
        type: String,
        required: false,
        
    }, 
    description : {
        type: String,
        required: false,
        
    },
    image: {
        type: String,
        required: false,          
    },
    user : {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,       
    },    
    likes:[{
        type:mongoose.Types.ObjectId, 
        ref: "User"
    }],
    like_count:{
      type: Number,
      default: 0
    },
    comments: [commentSchema],
    mentionedUsers: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
})

export default mongoose.model("Post", postSchema);

