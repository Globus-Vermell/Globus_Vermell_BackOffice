import express from "express";
import supabase from "../config.js";
const router = express.Router();


// Página principal — muestra los títulos en una lista
router.get("/", async (req, res) => {
  const {data:publications, error } = await supabase
    .from("publications")
    .select("*");

    if (error) {
      console.error("Error al obtener publicaciones:", error);
      return res.status(500).send("Error al obtener publicaciones");
    }
    res.render("publications/publications", { publications });
});


export default router;