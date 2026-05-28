import { Router } from "express";
import {
    getRecipes,
    getRecipeDetail,
    postRecipe,
    putRecipe,
    deleteRecipeById,
    postComment,
    postRating,
} from "../controllers/recipes.controller.js";

const router = Router();

router.get("/", getRecipes);
router.get("/:id", getRecipeDetail);

router.post("/", postRecipe);
router.put("/:id", putRecipe);
router.delete("/:id", deleteRecipeById);

router.post("/:id/comments", postComment);
router.post("/:id/ratings", postRating);

export default router;
