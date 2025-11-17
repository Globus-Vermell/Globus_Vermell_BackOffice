import express from "express";
import supabase from "../config.js";
const router = express.Router();


// Página principal — muestra los títulos en una lista
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

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const { data: building, error } = await supabase
    .from("buildings")
    .select("*")
    .eq("id_building", id)
    .single();

  if (error || !building) {
    console.error("Error al obtener la construcción:", error);
    return res.status(404).send("Construcción no encontrada");
  }

  res.render("construcciones/construccionesDetall", { building });
});

router.get("/:id/prizes", async (req, res) => {
  const id = Number(req.params.id);

  const { data, error } = await supabase
    .from("building_prizes")
    .select("id_prize")
    .eq("id_building", id); // Sin .single() para obtener múltiples/ningún resultado

  // --- Manejo de ERRORES de la base de datos ---
  if (error) {
    console.error("Error al obtener los premios de la construcción:", error);
    // Un error de BDD es un 500 (Internal Server Error)
    return res.status(500).json({ error: "Error interno del servidor al consultar premios." });
  }

  // --- Manejo de NO ENCONTRADO (array vacío) ---
  // Si 'data' es null, undefined, o un array vacío, no se encontraron premios.
  if (!data || data.length === 0) {
    // Si no hay datos, es un 404 (Not Found)
    return res.status(404).json({ message: "No se encontraron premios para esta edificacion." });
  }

  // --- Procesamiento de DATOS ENCONTRADOS ---
  // Si llegamos aquí, 'data' es un array con uno o más objetos { id_prize: X }.
  // Mapeamos para extraer solo los valores de id_prize en un nuevo array.
  const prizeIds = data.map(item => item.id_prize);

  // Devolvemos el array de IDs de premios.
  res.json({ prizes: prizeIds }); // La clave ahora es 'prizes' para indicar un array
});

router.get("/:id/years", async (req, res) => {
  const id = Number(req.params.id);
  
  const { data, error } = await supabase
    .from("building_reforms")
    .select("id_reform")
    .eq("id_building", id);
  if (error) {
    console.error("Error al obtener las reformas de la construcción:", error);
    return res.status(500).json({ error: "Error interno del servidor al consultar reformas." });
  }

  if (!data || data.length === 0) {
    return res.status(404).json({ message: "No se encontraron reformas para esta edificacion." });
  }

  const reformIds = data.map(item => item.id_reform);
  
  res.json({ reforms: reformIds }); 
});


export default router;