import { successResponse } from "./responseController.js";

export const handleGetUserProfile = (req, res, next) => {
  try {
    successResponse(res, {
      statusCode: 200,
      message: "User profile fetched successfully",
      payload: {
        user: {
          id: req.user.id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role,
          credits: req.user.credits,
          isActive: req.user.isActive,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
