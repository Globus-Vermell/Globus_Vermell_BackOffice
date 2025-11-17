import express from "express";
import supabase from "../config.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { data: nomenclaturas, error } = await supabase
    .from("nomenclature")
    .select("*");

  if (error) {
    console.error("Error al obtener nomenclaturas:", error);
    return res.status(500).send("Error al obtener nomenclaturas");
  }

  res.render("nomenclature/nomenclature", { nomenclaturas });
});


export default router;