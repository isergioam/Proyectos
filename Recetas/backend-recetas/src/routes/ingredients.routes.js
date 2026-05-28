import { Router } from "express";
import { getIngredients, postIngredient } from "../controllers/ingredients.controller.js";

const router = Router();

router.get("/", getIngredients);
router.post("/", postIngredient);

export default router;