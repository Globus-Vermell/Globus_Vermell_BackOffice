import express from "express";
import supabase from "../config.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { data: architects, error } = await supabase
    .from("architects")
    .select("*");

  if (error) {
    console.error("Error al obtener arquitectos:", error);
    return res.status(500).send("Error al obtener arquitectos");
  }

  res.render("architects/architects", { architects });});


export default router;