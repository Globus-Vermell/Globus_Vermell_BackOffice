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

  res.render("nomenclatura", { nomenclaturas });
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

  res.render("nomenclaturaDetall", { nomenclatura });
});

export default router;