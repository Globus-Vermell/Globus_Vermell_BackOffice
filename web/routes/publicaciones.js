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


export default router;