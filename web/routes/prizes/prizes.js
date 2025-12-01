import express from "express";
import { PrizeModel } from "../../models/PrizeModel.js";

//Constante y configuración del servidor Express
const router = express.Router();

//Ruta para obtener todos los premios
router.get("/", async (req, res) => {
    try {
        //Obtenemos todos los premios
        const prizes = await PrizeModel.getAll();
        res.render("prizes/prizes", { prizes });
    } catch (error) {
        res.status(500).send("Error al obtener premios");
    }
});

//Ruta para eliminar un premio
router.delete("/delete/:id", async (req, res) => {
    //Obtenemos el ID del premio
    const id = Number(req.params.id);
    try {
        //Eliminamos el premio
        await PrizeModel.delete(id);
        return res.json({ success: true, message: "Premi eliminat correctament!" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error al borrar." });
    }
});

//Exportamos el router para usarlo en index.js
export default router;