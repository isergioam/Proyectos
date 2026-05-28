import { httpError } from "../validations/httpError.js";
import {
    requireString,
    optionalInt,
    requireEmail,
    requireStars,
    requireDifficulty,
} from "../validations/validators.js";

import { getOrCreateUser } from "../services/auth.service.js";
import {
    listRecipes,
    getRecipeById,
    listRecipeIngredients,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    setRecipeIngredients,
} from "../services/recipes.service.js";

import { listCommentsByRecipe, createComment } from "../services/comments.service.js";
import { upsertRating, getRecipeRatingSummary } from "../services/ratings.service.js";
import { createIngredientIfNotExists, getIngredientById } from "../services/ingredients.service.js";

/**
 * GET /api/recipes
 * Query:
 *  - page, limit
 *  - q
 *  - ingredientId
 *  - minStars
 *  - order=recent|top
 */
export async function getRecipes(req, res, next) {
    try {
        const page = Math.max(1, Number(req.query.page || 1));
        const limit = Math.min(50, Math.max(1, Number(req.query.limit || 10)));

        const q = (req.query.q || "").toString().trim();
        const ingredientId = req.query.ingredientId ? Number(req.query.ingredientId) : null;
        const minStars = req.query.minStars ? Number(req.query.minStars) : null;
        const order = (req.query.order || "recent").toString();

        const result = await listRecipes({ page, limit, q, ingredientId, minStars, order });
        res.json(result);
    } catch (err) {
        next(err);
    }
}

/**
 * GET /api/recipes/:id
 * Devuelve receta + ingredientes + comentarios + resumen valoraciones
 */
export async function getRecipeDetail(req, res, next) {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id)) throw httpError(400, "id inválido");

        const recipe = await getRecipeById(id);
        if (!recipe) throw httpError(404, "Receta no encontrada");

        const ingredients = await listRecipeIngredients(id);
        const comments = await listCommentsByRecipe(id);
        const rating = await getRecipeRatingSummary(id);

        res.json({ recipe, ingredients, comments, rating });
    } catch (err) {
        next(err);
    }
}

/**
 * POST /api/recipes
 * Body:
 * {
 *   user: { nombre, email },
 *   recipe: { titulo, descripcion, pasos, tiempo_min?, dificultad, porciones?, foto_url? },
 *   ingredients: [
 *     { nombre? OR ingrediente_id?, cantidad?, unidad? }
 *   ]
 * }
 */
export async function postRecipe(req, res, next) {
    try {
        const userNombre = requireString(req.body?.user?.nombre, "user.nombre", 80);
        const userEmail = requireEmail(req.body?.user?.email);

        const titulo = requireString(req.body?.recipe?.titulo, "recipe.titulo", 120);
        const descripcion = requireString(req.body?.recipe?.descripcion, "recipe.descripcion", 500);
        const pasos = requireString(req.body?.recipe?.pasos, "recipe.pasos", 20000);

        const tiempo_min = optionalInt(req.body?.recipe?.tiempo_min, "recipe.tiempo_min");
        const porciones = optionalInt(req.body?.recipe?.porciones, "recipe.porciones");
        const dificultad = requireDifficulty(req.body?.recipe?.dificultad || "media");
        const foto_url =
            req.body?.recipe?.foto_url === undefined || req.body?.recipe?.foto_url === null || req.body?.recipe?.foto_url === ""
                ? null
                : requireString(req.body.recipe.foto_url, "recipe.foto_url", 500);

        const autorId = await getOrCreateUser({ nombre: userNombre, email: userEmail });

        const recipeId = await createRecipe({
            autorId,
            titulo,
            descripcion,
            pasos,
            tiempo_min,
            dificultad,
            porciones,
            foto_url,
        });

        const incoming = Array.isArray(req.body?.ingredients) ? req.body.ingredients : [];
        const normalized = [];

        for (const it of incoming) {
            // Permite: ingrediente_id o nombre (si nombre, se crea si no existe)
            if (it.ingrediente_id) {
                const ingId = Number(it.ingrediente_id);
                const ing = await getIngredientById(ingId);
                if (!ing) throw httpError(400, `ingrediente_id ${ingId} no existe`);
                normalized.push({
                    ingrediente_id: ingId,
                    cantidad: it.cantidad ?? null,
                    unidad: it.unidad ?? null,
                });
            } else if (it.nombre) {
                const name = requireString(it.nombre, "ingredients.nombre", 120);
                const ingId = await createIngredientIfNotExists(name);
                normalized.push({
                    ingrediente_id: ingId,
                    cantidad: it.cantidad ?? null,
                    unidad: it.unidad ?? null,
                });
            }
        }

        await setRecipeIngredients(recipeId, normalized);

        res.status(201).json({ id: recipeId });
    } catch (err) {
        next(err);
    }
}

/**
 * PUT /api/recipes/:id
 * Body:
 * {
 *   recipe: { titulo?, descripcion?, pasos?, tiempo_min?, dificultad?, porciones?, foto_url? },
 *   ingredients?: [...]
 * }
 */
export async function putRecipe(req, res, next) {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id)) throw httpError(400, "id inválido");

        const existing = await getRecipeById(id);
        if (!existing) throw httpError(404, "Receta no encontrada");

        const fields = {};

        if ("titulo" in (req.body.recipe || {})) fields.titulo = requireString(req.body.recipe.titulo, "recipe.titulo", 120);
        if ("descripcion" in (req.body.recipe || {})) fields.descripcion = requireString(req.body.recipe.descripcion, "recipe.descripcion", 500);
        if ("pasos" in (req.body.recipe || {})) fields.pasos = requireString(req.body.recipe.pasos, "recipe.pasos", 20000);

        if ("tiempo_min" in (req.body.recipe || {})) fields.tiempo_min = optionalInt(req.body.recipe.tiempo_min, "recipe.tiempo_min");
        if ("porciones" in (req.body.recipe || {})) fields.porciones = optionalInt(req.body.recipe.porciones, "recipe.porciones");
        if ("dificultad" in (req.body.recipe || {})) fields.dificultad = requireDifficulty(req.body.recipe.dificultad);

        if ("foto_url" in (req.body.recipe || {})) {
            const v = req.body.recipe.foto_url;
            fields.foto_url = v === null || v === "" ? null : requireString(v, "recipe.foto_url", 500);
        }

        await updateRecipe(id, fields);

        if (Array.isArray(req.body.ingredients)) {
            const normalized = [];
            for (const it of req.body.ingredients) {
                if (it.ingrediente_id) {
                    const ingId = Number(it.ingrediente_id);
                    const ing = await getIngredientById(ingId);
                    if (!ing) throw httpError(400, `ingrediente_id ${ingId} no existe`);
                    normalized.push({ ingrediente_id: ingId, cantidad: it.cantidad ?? null, unidad: it.unidad ?? null });
                } else if (it.nombre) {
                    const name = requireString(it.nombre, "ingredients.nombre", 120);
                    const ingId = await createIngredientIfNotExists(name);
                    normalized.push({ ingrediente_id: ingId, cantidad: it.cantidad ?? null, unidad: it.unidad ?? null });
                }
            }
            await setRecipeIngredients(id, normalized);
        }

        res.json({ ok: true });
    } catch (err) {
        next(err);
    }
}

/**
 * DELETE /api/recipes/:id
 */
export async function deleteRecipeById(req, res, next) {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id)) throw httpError(400, "id inválido");

        const affected = await deleteRecipe(id);
        if (!affected) throw httpError(404, "Receta no encontrada");

        res.json({ ok: true });
    } catch (err) {
        next(err);
    }
}

/**
 * POST /api/recipes/:id/comments
 * Body: { user:{nombre,email}, texto }
 */
export async function postComment(req, res, next) {
    try {
        const recetaId = Number(req.params.id);
        if (!Number.isInteger(recetaId)) throw httpError(400, "id inválido");

        const recipe = await getRecipeById(recetaId);
        if (!recipe) throw httpError(404, "Receta no encontrada");

        const nombre = requireString(req.body?.user?.nombre, "user.nombre", 80);
        const email = requireEmail(req.body?.user?.email);
        const texto = requireString(req.body?.texto, "texto", 800);

        const usuarioId = await getOrCreateUser({ nombre, email });
        const commentId = await createComment({ recetaId, usuarioId, texto });

        res.status(201).json({ id: commentId });
    } catch (err) {
        next(err);
    }
}

/**
 * POST /api/recipes/:id/ratings
 * Body: { user:{nombre,email}, estrellas }
 */
export async function postRating(req, res, next) {
    try {
        const recetaId = Number(req.params.id);
        if (!Number.isInteger(recetaId)) throw httpError(400, "id inválido");

        const recipe = await getRecipeById(recetaId);
        if (!recipe) throw httpError(404, "Receta no encontrada");

        const nombre = requireString(req.body?.user?.nombre, "user.nombre", 80);
        const email = requireEmail(req.body?.user?.email);
        const estrellas = requireStars(req.body?.estrellas);

        const usuarioId = await getOrCreateUser({ nombre, email });
        await upsertRating({ recetaId, usuarioId, estrellas });

        const rating = await getRecipeRatingSummary(recetaId);
        res.json({ ok: true, rating });
    } catch (err) {
        next(err);
    }
}
