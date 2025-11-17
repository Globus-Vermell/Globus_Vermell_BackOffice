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

  res.render("protection/protection", { protections });
});

export default router;