import express from "express";
import supabase from "../config.js";


const router = express.Router();

// Listado de arquitectos
router.get("/arquitectos", async (req, res) => {
  const { data: architects, error } = await supabase
    .from("architects")
    .select("*");

  if (error) {
    console.error("Error al obtener arquitectos:", error);
    return res.status(500).send("Error al obtener arquitectos");
  }

  res.render("arquitectos", { architects });
});


export default router;