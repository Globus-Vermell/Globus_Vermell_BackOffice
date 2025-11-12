import express from "express";
import supabase from "../config.js";
const router = express.Router();


// Página principal — muestra los títulos en una lista
router.get("/", async (req, res) => {
 const {data:buildings, error } = await supabase
    .from("buildings")
    .select("*");

    if (error) {
      console.error("Error al obtener las construcciones:", error);
      return res.status(500).send("Error al obtener construcciones");
    }
    res.render("construcciones", { buildings });
});

router.get("/:id", async (req, res) => {
  const {id} = req.params;
  const {data: building, error } =await supabase
    .from("buildings")
    .select("*")
    .eq("id_building", id)
    .single();

    if (error || !building){
      console.error("Error al obtener la construcción:", error);
      return res.status(404).send("Construcción no encontrada");
    }

    res.render("construccionesDetall", { building });
});
export default router;