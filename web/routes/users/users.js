import express from "express";
import { UserModel } from "../../models/UserModel.js";
import { isAdmin } from "../../middlewares/auth.js";

// Constante y configuración del srvidor Express
const router = express.Router();

// Ruta para obtener todos los usuarios
router.get("/", isAdmin, async (req, res) => {
    try {
        // Obtenemos todos los usuarios
        const users = await UserModel.getAll();
        res.render("users/users", { users });
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).send("Error en obtenir usuaris");
    }
});

// Ruta para eliminar un usuario
router.delete("/delete/:id", isAdmin, async (req, res) => {
    // Obtenemos el id del usuario
    const id = Number(req.params.id);

    try {
        // Eliminamos el usuario
        await UserModel.delete(id);
        return res.json({ success: true, message: "Usuari eliminat correctament!" });
    } catch (error) {
        console.error("Error borrando usuario:", error);
        return res.status(500).json({ success: false, message: "Error a l'esborrar l'usuari." });
    }
});

// Exportar el router para usarlo en index.js
export default router;