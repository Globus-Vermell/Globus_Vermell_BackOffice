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

  res.render("reform/reform", { reformas });
});

export default router;