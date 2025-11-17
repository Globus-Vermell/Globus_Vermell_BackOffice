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

  res.render("reformas/reformas", { reformas });
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

  res.render("reformas/reformaDetall", { reforma });
});



export default router;