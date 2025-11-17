import express from "express";
import supabase from "../config.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.render("FormularioEdificacion");
});

router.get("/publicacions", async (req, res) => {
    const { data, error } = await supabase
        .from("publications")
        .select("id_publication, title");

    if (error) return res.status(500).json([]);
    res.json(data);
});

router.get("/arquitectes", async (req, res) => {
    const { data, error } = await supabase
        .from("architects")
        .select("id_architect, name");

    if (error) return res.status(500).json([]);
    res.json(data);
});

router.get("/tipologies", async (req, res) => {
    const { data, error } = await supabase
        .from("typology")
        .select("id_typology, name");

    if (error) return res.status(500).json([]);
    res.json(data);
});

router.post("/", async (req, res) => {
    const { nom, adreca, any_construccio, publicacio_id, arquitectes, tipologia } = req.body;

    try {
        const { error } = await supabase
            .from("buildings")
            .insert([{
                name: nom,
                picture: "provisional.jpg",
                coordinates: adreca,
                constuction_year:  parseInt(any_construccio),
                id_publication:  parseInt(publicacio_id),
                id_architect:   parseInt(arquitectes),
                id_typology:  parseInt(tipologia)
            }]);

        if (error) {
            console.error("Error al guardar:", error);
            return res.status(400).json({ success: false, message: "Error al guardar la edificación" });
        }

        res.json({ success: true, message: "Edificació guardada correctament!" });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
});

export default router;