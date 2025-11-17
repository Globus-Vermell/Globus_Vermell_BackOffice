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

  res.render("arquitectos/arquitectos", { architects });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const { data: architect, error } = await supabase
    .from("architects")
    .select("*")
    .eq("id_architect", id)
    .single();

  if (error || !architect) {
    console.error("Error al obtener el arquitecto:", error);
    return res.status(404).send("Arquitecto no encontrado");
  }

  res.render("arquitectos/arquitectoDetall", { architect });
});

router.get("/:id/name", async (req, res) => {
  const id = Number(req.params.id);
  const { data, error } = await supabase
    .from("architects")
    .select("name")
    .eq("id_architect", id)
    .single();

  if (error || !data) {
    console.error("Error al obtener el nombre del arquitecto:", error);
    return res.status(404).json({ error: "Nombre no encontrado" });
  }

  res.json({ name: data.name });
});

export default router;