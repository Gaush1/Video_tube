import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { Video } from "../models/video.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "videoId is not valid!");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "video not found");
  }

  // match and finds all the comments
  const aggregateComments = await Comment.aggregate([
    {
      $match: {
        video: new mongoose.Types.ObjectId(videoId),
      },
    },
  ]);

  Comment.aggregatePaginate(aggregateComments, {
    page,
    limit,
  })
    .then((result) => {
      return res
        .status(201)
        .json(
          new ApiResponse(200, result, "VideoComments fetched  successfully!!")
        );
    })
    .catch((error) => {
      throw new ApiError(
        500,
        "something went wrong while fetching video Comments",
        error
      );
    });
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  const { videoId } = req.params;
  const { comment } = req.body;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "videoId is invalid!");
  }

  if (!comment || comment?.trim() === "") {
    throw new ApiError(400, "Please add an comment");
  }

  const video = await Video.findOne(videoId);
  if (!video) {
    throw new ApiError(400, "Video does not exist");
  }

  const newcomment = await Comment.create({
    content: comment,
    video: videoId,
    owner: req.user?._id,
  });

  if (!newcomment) {
    throw new ApiError(500, "something went wrong while creating comment");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, newcomment, "comment created successfully!!"));
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment

  const { commentId } = req.params;
  const { newComment } = req.body;

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Comment id is not valid!");
  }

  if (!newComment && newComment?.trim === "") {
    throw new ApiError(400, "Comment content is required!");
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment does not exist");
  }

  if (comment.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(
      403,
      "You don't have permission to update this comment!"
    );
  }

  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    {
      $set: {
        content: newComment,
      },
    },
    { new: true }
  );

  if (!updatedComment) {
    throw new ApiError(500, "something went wrong while updating comment");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(200, updatedComment, "comment updated successfully!!")
    );
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  const { commentId } = req.params;

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Comment id is not valid!");
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment does not exist");
  }

  if (comment.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(
      403,
      "You don't have permission to delete this comment!"
    );
  }

  const deletedComment = await Comment.findByIdAndDelete(commentId);
  if (!deletedComment) {
    throw new ApiError(500, "Unable to delete the comment");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment deleted Successfully"));
});

export { getVideoComments, addComment, updateComment, deleteComment };
