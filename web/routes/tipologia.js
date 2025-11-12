import express from "express";
import supabase from "../config.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { data: typologies, error } = await supabase
    .from("typology")
    .select("*");

  if (error) {
    console.error("Error al obtener tipologías:", error);
    return res.status(500).send("Error al obtener tipologías");
  }

  res.render("tipologia", { typologies });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const { data: typology, error } = await supabase
    .from("typology")
    .select("*")
    .eq("id_typology", id)
    .single();

  if (error || !typology) {
    console.error("Error al obtener la tipología:", error);
    return res.status(404).send("Tipología no encontrada");
  }

  res.render("tipologiaDetall", { typology });
});

export default router;