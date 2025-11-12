import express from "express";
import supabase from "../config.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { data: reformas, error } = await supabase
    .from("reform")
    .select("*");

  if (error) {
    console.error("Error al obtener reformas:", error);
    return res.status(500).send("Error al obtener reformas");
  }

  res.render("reformas", { reformas });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const { data: reforma, error } = await supabase
    .from("reform")
    .select("*")
    .eq("id_reform", id)
    .single();

  if (error || !reforma) {
    console.error("Error al obtener la reforma:", error);
    return res.status(404).send("Reforma no encontrada");
  }

  res.render("reformaDetall", { reforma });
});

// Obtener solo el año de una reforma por id (devuelve JSON)
router.get("/:id/year", async (req, res) => {
  const id = Number(req.params.id);
  const { data, error } = await supabase
    .from("reform")
    .select("year")
    .eq("id_reform", id)
    .single();

  if (error || !data) {
    console.error("Error al obtener el año de la reforma:", error);
    return res.status(404).json({ error: "Año no encontrado" });
  }

  res.json({ year: data.year });
});

export default router;