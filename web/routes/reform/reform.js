import express from "express";
import { ReformModel } from "../../models/ReformModel.js";

// Constante y configuración del servidor Express
const router = express.Router();

// Ruta para obtener todas las reformas
router.get("/", async (req, res) => {
	try {
		// Obtenemos todas las reformas
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 15;
		const result = await ReformModel.getAll(page, limit);
		const reformas = result.data;
		res.render("reform/reform", { reformas, pagination: result.pagination });
	} catch (error) {
		console.error("Error al obtener reformas:", error);
		res.status(500).send("Error al obtener reformas");
	}
});

// Ruta para eliminar una reforma
router.delete("/delete/:id", async (req, res) => {
	// Obtenemos el id de la reforma
	const id = Number(req.params.id);

	try {
		// Borrar la reforma de la base de datos
		await ReformModel.delete(id);
		return res.json({ success: true, message: "Reforma eliminada correctament!" });
	} catch (error) {
		console.error("Error borrando:", error);
		return res.status(500).json({ success: false, message: "Error al borrar." });
	}
});

// Exportar el router para usarlo en index.js
export default router;