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

  res.render("prizes/prizes", { prizes });
});



export default router;