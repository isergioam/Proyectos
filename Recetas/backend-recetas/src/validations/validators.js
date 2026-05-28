import { httpError } from "./httpError.js";

export function requireString(value, fieldName, maxLen = 5000) {
    if (typeof value !== "string") throw httpError(400, `${fieldName} debe ser texto`);
    const v = value.trim();
    if (!v) throw httpError(400, `${fieldName} es obligatorio`);
    if (v.length > maxLen) throw httpError(400, `${fieldName} supera ${maxLen} caracteres`);
    return v;
}

export function optionalInt(value, fieldName) {
    if (value === null || value === undefined || value === "") return null;
    const n = Number(value);
    if (!Number.isInteger(n) || n < 0) throw httpError(400, `${fieldName} debe ser un entero >= 0`);
    return n;
}

export function requireEmail(value) {
    const v = requireString(value, "email", 120);
    // validación simple (sin regex de la NASA)
    if (!v.includes("@") || !v.includes(".")) throw httpError(400, "email no parece válido");
    return v.toLowerCase();
}

export function requireStars(value) {
    const n = Number(value);
    if (!Number.isInteger(n) || n < 1 || n > 5) throw httpError(400, "estrellas debe ser un entero entre 1 y 5");
    return n;
}

export function requireDifficulty(value) {
    const v = requireString(value, "dificultad", 10);
    const allowed = ["facil", "media", "dificil"];
    if (!allowed.includes(v)) throw httpError(400, `dificultad debe ser: ${allowed.join(", ")}`);
    return v;
}
