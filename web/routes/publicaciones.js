import express from "express";
import fs from "fs";

const router = express.Router();

// Leer publicaciones del JSON
const readPublicaciones = () => {
  try {
    const data = fs.readFileSync("publicacionesdb.json", "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error leyendo el archivo:", error);
    return [];
  }
};

// Página principal — muestra los títulos en una lista
router.get("/", (req, res) => {
  const publicaciones = readPublicaciones();
  res.render("publicaciones", { publicaciones });
});

// Página de detalle — muestra 1 publicación por ID
router.get("/:id", (req, res) => {
  const publicaciones = readPublicaciones();
  const id = parseInt(req.params.id);
  const publicacion = publicaciones.find((p) => p.id_Publication === id);

  if (!publicacion) {
    return res.status(404).send("Publicación no encontrada");
  }

  res.render("publicacionDetall", { publicacion });
});

export default router;