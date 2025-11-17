import express from "express";
import supabase from "../config.js";
const router = express.Router();


router.get("/", async (req, res) => {
  const { data: buildings, error } = await supabase
    .from("buildings")
    .select("*");

  if (error) {
    console.error("Error al obtener las construcciones:", error);
    return res.status(500).send("Error al obtener construcciones");
  }
  res.render("construcciones/construcciones", { buildings });
});


export default router;