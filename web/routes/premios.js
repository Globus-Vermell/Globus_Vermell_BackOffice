import express from "express";
import supabase from "../config.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { data: prizes, error } = await supabase
    .from("prizes")
    .select("*");

  if (error) {
    console.error("Error al obtener premios:", error);
    return res.status(500).send("Error al obtener premios");
  }

  res.render("premios/premios", { prizes });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const { data: prize, error } = await supabase
    .from("prizes")
    .select("*")
    .eq("id_prize", id)
    .single();

  if (error || !prize) {
    console.error("Error al obtener el premio:", error);
    return res.status(404).send("Premio no encontrado");
  }

  res.render("premios/premioDetall", { prize });
});

router.get("/:id/name", async (req, res) => {
  const { id } = req.params;

  const { data: prize, error } = await supabase
    .from("prizes")
    .select("name")
    .eq("id_prize", id)
    .single();

  if (error || !prize) {
    console.error("Error al obtener el premio:", error);
    return res.status(404).send("Premio no encontrado");
  }

  res.json({ prize: prize.name });
});

export default router;