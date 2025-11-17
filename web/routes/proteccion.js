import express from "express";
import supabase from "../config.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { data: protections, error } = await supabase
    .from("protection")
    .select("*");

  if (error) {
    console.error("Error al obtener protecciones:", error);
    return res.status(500).send("Error al obtener protecciones");
  }

  res.render("proteccion/proteccion", { protections });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const { data: protection, error } = await supabase
    .from("protection")
    .select("*")
    .eq("id_protection", id)
    .single();

  if (error || !protection) {
    console.error("Error al obtener la protección:", error);
    return res.status(404).send("Protección no encontrada");
  }

  res.render("proteccion/proteccionDetall", { protection });
});

router.get("/:id/level", async (req, res) => {
  const id = Number(req.params.id);
  const { data, error } = await supabase
    .from("protection")
    .select("level")
    .eq("id_protection", id)
    .single();

  if (error || !data) {
    console.error("Error al obtener el nivel de la protección:", error);
    return res.status(404).json({ error: "Nivel no encontrado" });
  }

  res.json({ level: data.level });
});

export default router;