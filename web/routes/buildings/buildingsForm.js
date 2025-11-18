import express from "express";
import supabase from "../../config.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.render("buildings/buildingsForm");
});

router.get("/publications", async (req, res) => {
    const { data } = await supabase
        .from("publications")
        .select("id_publication, title");
    res.json(data || []);
});

router.get("/architects", async (req, res) => {
    const { data } = await supabase
        .from("architects")
        .select("id_architect, name");
    res.json(data || []);
});

router.get("/typologies", async (req, res) => {
    const { data } = await supabase
        .from("typology")
        .select("id_typology, name");
    res.json(data || []);
});

router.get("/protection", async (req, res) => {
    const { data } = await supabase
        .from("protection")
        .select("id_protection, level");
    res.json(data || []);
});

router.get("/nomenclature", async (req, res) => {
    const { data } = await supabase
        .from("nomenclature")
        .select("id_nomenclature, name");
    res.json(data || []);
});

router.post("/", async (req, res) => {
    const {
        nom, adreca, any_construccio, picture, description, surface_area,
        publicacio_id, arquitectes, tipologia, id_protection, id_nomenclature
    } = req.body;

    try {
        const { error } = await supabase.from("buildings").insert([{
            name: nom,
            picture: picture,
            coordinates: adreca,
            construction_year: parseInt(any_construccio),
            description,
            surface_area: parseInt(surface_area),
            id_publication: parseInt(publicacio_id),
            id_architect: parseInt(arquitectes),
            id_typology: parseInt(tipologia),
            id_protection: parseInt(id_protection),
            id_nomenclature: parseInt(id_nomenclature)
        }]);
        if (error) throw error;
        res.json({ success: true, message: "Edificación guardada correctamente!" });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
});

export default router;