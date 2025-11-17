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

  res.render("typology/typology", { typologies });
});

export default router;