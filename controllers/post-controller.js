
import Post from "../model/Post";
import User from "../model/User";
import  {auth}  from "../middleware/auth";


//Add Post
export const addPost = async (req, res, next) => {
  // Add auth middleware to authenticate the user
  auth(req, res, async () => {
    console.log(req.body, req.file, 10);
    const { title, description } = req.body;
    const userId = req.userData.userId; // Get user ID from middleware

    let imageSrc;
    let existingUser;

    try {
      existingUser = await User.findById(userId);
    } catch (error) {
      return console.log(error);
    }

    if (!existingUser) {
      return res.status(400).json({ message: "Unable to find user by ID" });
    }

    if (req.file) {
      imageSrc = req.file.filename;
    }

    const post = new Post({
      title,
      description,
      image: imageSrc,
      user: existingUser._id, // Assign user ID to new post
    });
    try {
      await post.save();
      existingUser.posts.push(post);
      await existingUser.save();
        
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error });
    }
    
    return res.status(200).json({ post });
  });
};

//All Post 
export const getAllPost = async (req, res, next) => {
  auth(req, res, async () => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 3;
  const skip = (page - 1) * limit;
 

  try {
    const count = await Post.countDocuments();
    const posts = await Post.find()
      .skip(skip)
      .limit(limit)
      .populate({
        path: "user",
        select: "name email", 
      })
      .populate({
        path: "likes",
        select: "name", 
      });
      

    if (posts.length === 0) {
      return res.status(404).json({ message: "No posts found" });
    }

    const totalPages = Math.ceil(count / limit);

    return res.status(200).json({ posts, totalPages });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
}); 
};




  //Update Post 
export const updatePost = async(req, res, next) => {
  // Add auth middleware to authenticate the user
  auth(req, res, async () => {
    const {title, description }= req.body;
    let imageSrc;
    if (req.file) {
      imageSrc = req.file.filename;
    }
    const postId = req.params.id;
    let post;
    try {
      if (imageSrc) {
        post = await Post.findByIdAndUpdate(postId, {
          title,
          description,
          image: imageSrc,
        });
      } else {
        post = await Post.findByIdAndUpdate(postId, {
          title,
          description,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Unable to update the post" });
    }
    if (!post) {
      return res.status(500).json({ message: "Unable to update the post" });
    }
    return res.status(200).json({ post });
  });
};


  

  //Get By Id
export const getById = async (req, res, next) => {
  auth(req, res, async () => {
  const id = req.params.id;
  let post;
  try {
    post = await Post.findById(id).populate("user");
  } catch (error) {
    return console.log(error);
  }
  if (!post) {
    return res.status(404).json({ message: "No post found" });
  }
  return res.status(200).json({ post });
  });
};




//Delete By Id
export const deletePost = async(req, res, next) => {
  auth(req, res, async () => {
    const id = req.params.id;

    let post;
    try {
        post = await Post.findByIdAndRemove(id).populate('user');
        await post.user.posts.pull(post);
        await post.user.save();
    } catch (error) {
        console.log(error);
    }
    if(!post){
        return res.status(500).json({message: "Unable to Delete"})
    }
    return res.status(200).json({message: "Successfully Deleted"});
  })  
  
};



//Get User By ID
export const getByUserId = async (req, res, next)=>{
    auth(req, res, async() => {
      const userId = req.params.id;
      let userPosts;
      try {
          userPosts = await User.findById(userId).populate("posts");
      } catch (error) {
          return console.log(error)
      }
      if(!userPosts){
          return res.status(404).json({message: "No Blog Found"});
      }
      return res.status(200).json({user:userPosts})
    })
}


// add like to a post
// export const addLike = async (req, res) => {
//   const userId = req.userData.userId; 
//   const postId = req.params.id;

//   try {
//     const post = await Post.findById(postId);

//     // check if user already liked the post
//     if (post.likes.includes(userId)) {
//       return res.status(400).json({ message: "User already liked the post" });
//     }

//     post.likes.push(userId);
//     await post.save();

//     res.status(200).json({ message: "Post liked successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };



// // remove like from a post
// export const removeLike = async (req, res) => {
//   const userId = req.userData.userId; 
//   const postId = req.params.id;

//   try {
//     const post = await Post.findById(postId);

//     // check if user has liked the post
//     if (!post.likes.includes(userId)) {
//       return res
//         .status(400)
//         .json({ message: "User has not liked the post yet" });
//     }

//     post.likes.pull(userId);
//     await post.save();

//     res.status(200).json({ message: "Post unliked successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };
// add like to a post
export const addLike = async (req, res) => {
  const userId = req.userData.userId; 
  const postId = req.params.id;

  try {
    const post = await Post.findById(postId);

    // check if user already liked the post
    if (post.likes.includes(userId)) {
      return res.status(400).json({ message: "User already liked the post" });
    }

    post.likes.push(userId);
    post.like_count += 1; // Increment like_count
    await post.save();

    res.status(200).json({ message: "Post liked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// remove like from a post
export const removeLike = async (req, res) => {
  const userId = req.userData.userId; 
  const postId = req.params.id;

  try {
    const post = await Post.findById(postId);

    // check if user has liked the post
    if (!post.likes.includes(userId)) {
      return res
        .status(400)
        .json({ message: "User has not liked the post yet" });
    }

    post.likes.pull(userId);
    post.like_count -= 1; // Decrement like_count
    await post.save();

    res.status(200).json({ message: "Post unliked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};


//Add Comment
export const addComment = async (req, res, next) => {
  auth(req, res, async () => {
    const { comment } = req.body;
    const postId = req.params.id;
    const userId = req.userData.userId;

    try {
      const post = await Post.findById(postId);

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const newComment = {
        comment,
        user: userId,
        post: postId,
        userName: user.name,
      };

      post.comments.push(newComment);
      await post.save();

      return res.status(200).json({ comment: newComment });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server error" });
    }
  });
};

//Get All Comment by Post ID
export const getAllComments = async (req, res, next) => {
  auth(req, res, async () => {
    const postId = req.params.id;

    try {
      const post = await Post.findById(postId).populate({
        path: "comments.user",
        select: "name email",
      });

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      const comments = post.comments.map(comment => ({
        id: comment._id,
        comment: comment.comment,
        userName: comment.user.name,
        timestamp: comment.timestamp,
      }));

      return res.status(200).json({ comments });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server error" });
    }
  });
}

// Edit Comment
export const editComment = async (req, res, next) => {
  auth(req, res, async () => {
    const { comment } = req.body;
    const commentId = req.params.commentId;
    const userId = req.userData.userId;
    try {
      const post = await Post.findOne({ "comments._id": commentId });

      if (!post) {
        return res.status(404).json({ message: "Comment not found" });
      }

      const commentIndex = post.comments.findIndex(
        (comment) => comment._id.toString() === commentId
      );

      if (post.comments[commentIndex].user.toString() !== userId) {
        return res
          .status(401)
          .json({ message: "You are not authorized to edit this comment" });
      }

      post.comments[commentIndex].comment = comment;
      await post.save();

      const updatedComment = {
        id: post.comments[commentIndex]._id,
        comment,
        userName: post.comments[commentIndex].userName,
        timestamp: post.comments[commentIndex].timestamp,
      };

      return res.status(200).json({ comment: updatedComment });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server error" });
    }
  });
};




// Delete Comment
export const deleteComment = async (req, res, next) => {
auth(req, res, async () => {
const commentId = req.params.commentId;
const userId = req.userData.userId;
  
try {
  const post = await Post.findOne({ "comments._id": commentId });

  if (!post) {
    return res.status(404).json({ message: "Comment not found" });
  }

  const commentIndex = post.comments.findIndex(
    (comment) => comment._id.toString() === commentId
  );

  if (post.comments[commentIndex].user.toString() !== userId) {
    return res
      .status(401)
      .json({ message: "You are not authorized to delete this comment" });
  }

  post.comments.splice(commentIndex, 1);
  await post.save();

  return res.status(200).json({ message: "Comment deleted successfully" });
} catch (error) {
  console.log(error);
  return res.status(500).json({ message: "Server error" });
}
});
};



