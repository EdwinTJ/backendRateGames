import { PrismaClient } from "@prisma/client";
import { cloudinary } from "../util/cloudinary";
import HttpError from "../middleware/http-error";
//import Types
import type { Request, Response, NextFunction } from "express";
const prisma = new PrismaClient();

export const getAllPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pageSize = 12;
  const page = Number(req.query.pageNumber) || 1;
  const count = await prisma.post.count();

  try {
    const post = await prisma.post.findMany({
      include: {
        comments: true,
        image: true,
      },
      skip: pageSize * (page - 1),
      take: pageSize,
    });
    res.json({
      success: true,
      post,
      page,
      pages: Math.ceil(count / pageSize),
      count,
    });
  } catch (err) {
    const error = new HttpError("Something went wrong", 500);
    return next(error);
  }
};

// Get a single post
export const getSinglePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const single = await prisma.post.findUnique({
      where: {
        id: id,
      },
      include: {
        image: true,
        // comments: true,
        // Should I send the comments with the post?
      },
    });
    res.json({
      success: true,
      post: single,
    });
  } catch (err) {
    const error = new HttpError("Something went wrong", 500);
    return next(error);
  }
};

// Create a new post
export const newPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, image } = req.body;

  try {
    if (image === null || image === undefined) {
      const newPost = await prisma.post.create({
        data: {
          title,
        },
      });
      res.json({
        success: true,
        newPost,
      });
    } else {
      //TODO: Upload image to cloudinary
      // 1. Upload image to cloudinary
      // 2. Get the image url
      // 3. Get the public url and public id from cloudinary
      // 4. Save the public url and public id to the database
      const publicId = image + "publicId";
      const newPost = await prisma.post.create({
        data: {
          title,
          image: {
            create: {
              url: image,
              public_id: publicId,
            },
          },
        },
      });
      res.json({
        success: true,
        newPost,
      });
    }
  } catch (err) {
    const error = new HttpError("Something went wrong", 500);
    return next(error);
  }
};

// Update a post
export const updatePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { title } = req.body;
  try {
    const updated = await prisma.post.update({
      where: {
        id: id,
      },
      data: {
        title,
      },
    });
    res.json({
      success: true,
      updated,
    });
  } catch (err) {
    const error = new HttpError("Something went wrong", 500);
    return next(error);
  }
};

// Delete a post
export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const deleted = await prisma.post.delete({
      where: { id: id },
    });

    Promise.all([deleted])
      .then(() => {
        res.status(200).json({
          success: true,
          message: "Post deleted successfully",
        });
      })
      .catch((error) => {
        console.log("Error inside Promise:" + error);
      });
  } catch (err) {
    const error = new HttpError("Something went wrong", 500);
    return next(error);
  }
};
