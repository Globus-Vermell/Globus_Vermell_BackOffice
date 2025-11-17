import express from "express";
import supabase from "../config.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { data: nomenclaturas, error } = await supabase
    .from("nomenclature")
    .select("*");

  if (error) {
    console.error("Error al obtener nomenclaturas:", error);
    return res.status(500).send("Error al obtener nomenclaturas");
  }

  res.render("nomenclatura/nomenclatura", { nomenclaturas });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const { data: nomenclatura, error } = await supabase
    .from("nomenclature")
    .select("*")
    .eq("id_nomenclature", id)
    .single();

  if (error || !nomenclatura) {
    console.error("Error al obtener la nomenclatura:", error);
    return res.status(404).send("Nomenclatura no encontrada");
  }

  res.render("nomenclatura/nomenclaturaDetall", { nomenclatura });
});

// Obtener solo el nombre de una publicación por id (devuelve JSON)
router.get("/:id/name", async (req, res) => {
  const id = Number(req.params.id);
  const { data, error } = await supabase
    .from("nomenclature")
    .select("name")
    .eq("id_nomenclature", id)
    .single();

  if (error || !data) {
    console.error("Error al obtener el título de la publicación:", error);
    return res.status(404).json({ error: "Título no encontrado" });
  }

  res.json({ name: data.name });
});

export default router;