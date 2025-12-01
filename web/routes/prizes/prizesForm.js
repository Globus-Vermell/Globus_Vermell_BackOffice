import express from "express";
import { PrizeModel } from "../../models/PrizeModel.js";

//Constante y configuración del servidor Express
const router = express.Router();

//Ruta para obtener el formulario de creación de premios
router.get("/", (req, res) => {
    res.render("prizes/prizesForm");
});

//Ruta para crear un premio
router.post("/", async (req, res) => {
    //Obtenemos los datos del formulario
    const { name, tipe, year, description } = req.body;

    //Validamos los datos
    if (!name) {
        return res.status(400).json({ success: false, message: "El nom és obligatori" });
    }

    //Guardamos el premio
    try {
        await PrizeModel.create({
            name,
            tipe,
            year: parseInt(year),
            description
        });

        return res.json({ success: true, message: "Premi guardat correctament!" });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Error intern del servidor" });
    }
});

//Exportamos el router para usarlo en index.js
export default router;