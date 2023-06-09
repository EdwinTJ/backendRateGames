import { PrismaClient } from "@prisma/client";
import HttpError from "../middleware/http-error";
import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";
//Types
import type { Request, Response, NextFunction } from "express";
const prisma = new PrismaClient();

// Get Comments for a post
export const getAllComments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const pageSize = 8;
  const page = Number(req.query.pageNumber) || 1;
  const count = await prisma.post.count();
  try {
    const comment = await prisma.comment.findMany({
      where: {
        postId: id,
      },
      skip: pageSize * (page - 1),
      take: pageSize,
    });
    res.json({
      success: true,
      comment: comment,
      page,
      pages: Math.ceil(count / pageSize),
      count,
    });
  } catch (err) {
    const error = new HttpError("Something went wrong", 500);
    return next(error);
  }
};

//Create a new rate limit for a user, that allows 3 requests per minute
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  analytics: true,
});

// Create a new comment for a post
export const newComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { text, authorId } = req.body;
  const { success } = await ratelimit.limit(authorId);
  if (!success) {
    const error = new HttpError(
      "You have exceeded the limit of 3 requests",
      429
    );
    return (
      next(error),
      res.json({
        success: false,
        message: "You have exceeded the limit of 3 requests per minute",
      })
    );
  }
  if (text === null || text === undefined) {
    return res.json({
      success: false,
      message: "Please enter a comment",
    });
  }
  try {
    const newComment = await prisma.comment.create({
      data: { text, authorID: authorId, postId: id },
    });
    res.json({
      success: true,
      newComment,
    });
  } catch (err) {
    const error = new HttpError("Something went wrong", 500);
    return next(error);
  }
};
// Update a comment for a post
export const updateComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { text } = req.body;
  try {
    const comment = await prisma.comment.update({
      where: {
        id: id,
      },
      data: {
        text,
      },
    });
    res.json({
      success: true,
      message: "Comment updated successfully",
    });
  } catch (err) {
    const error = new HttpError("Something went wrong", 500);
    return next(error);
  }
};

//Delete a comment for a post
export const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    await prisma.comment.delete({
      where: {
        id: id,
      },
    });
    res.json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (err) {
    const error = new HttpError("Something went wrong", 500);
    return next(error);
  }
};
