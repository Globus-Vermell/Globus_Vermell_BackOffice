import express from "express";
import supabase from "../../config.js";

const router = express.Router();

router.get("/:id", async (req, res) => {
    const id = Number(req.params.id);

    const { data: building, error: buildingError } = await supabase
        .from("buildings")
        .select("*")
        .eq("id_building", id)
        .single();

    if (buildingError || !building) {
        console.error("Error al obtener building:", buildingError);
        return res.status(404).send("Edificació no trobada");
    }
    res.render("buildings/buildingsEdit", { building });

});

router.get("/:id/publications", async (req, res) => {
    const { data, error } = await supabase
        .from("publications")
        .select("id_publication, title");
    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
});

router.get("/:id/architects", async (req, res) => {
    const { data, error } = await supabase
        .from("architects")
        .select("id_architect, name");
    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
});

router.get("/:id/typologies", async (req, res) => {
    const { data, error } = await supabase
        .from("typology")
        .select("id_typology, name");
    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
});

router.get("/:id/protections", async (req, res) => {
    const { data, error } = await supabase
        .from("protection")
        .select("id_protection, level");
    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
});

router.get("/:id/nomenclature", async (req, res) => {
    const { data, error } = await supabase
        .from("nomenclature")
        .select("id_nomenclature, name");
    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
});

router.put("/:id", async (req, res) => {
    const id = Number(req.params.id);
    const {
        nom,
        adreca,
        any_construccio,
        picture,
        description,
        surface_area,
        publicacio_id,
        arquitectes,
        tipologia,
        id_protection,
        id_nomenclature
    } = req.body;

    try {
        const { error } = await supabase
            .from("buildings")
            .update({
                name: nom,
                coordinates: adreca,
                construction_year: parseInt(any_construccio),
                picture,
                description,
                surface_area: parseInt(surface_area),
                id_publication: parseInt(publicacio_id),
                id_architect: parseInt(arquitectes),
                id_typology: parseInt(tipologia),
                id_protection: parseInt(id_protection),
                id_nomenclature: parseInt(id_nomenclature)
            })
            .eq("id_building", id);

        if (error) {
            console.error("Error al actualizar building:", error);
            return res.status(400).json({ success: false, message: "Error al actualizar la edificació" });
        }

        res.json({ success: true, message: "Edificació actualitzada correctament!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error intern del servidor" });
    }
});

export default router;