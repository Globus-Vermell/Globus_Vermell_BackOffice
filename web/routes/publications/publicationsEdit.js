import express from 'express';
import supabase from '../../config.js';


// Constante y configuración del srvidor Express
const router = express.Router();

// Ruta para obtener una publicación por ID para editar
router.get('/:id', async (req, res) => {
    const id = Number(req.params.id);
    // Buscamos la publicación por ID
    const { data: publication, error } = await supabase
        .from('publications')
        .select('*')
        .eq('id_publication', id)
        .single();

    if (error || !publication) {
        console.error('Error fetching publication:', error);
        return res.status(404).send('Publicació no trobada');
    }
    // Buscamos todas las tipologías para mostrarlas en el formulario
    const { data: allTypologies, error: typeError } = await supabase
        .from('typology')
        .select('*')
        .order('name');

    if (typeError) console.error(typeError);

    // Buscamos las relaciones entre publicación y tipología para mostrarlas en el formulario
    const { data: existingRelations, error: relError } = await supabase
        .from('publication_typologies')
        .select('id_typology')
        .eq('id_publication', id);

    if (relError) console.error(relError);

    // Convertimos la respuesta [{id_typology: 1}, {id_typology: 3}] a un array simple [1, 3]
    const currentTypologies = existingRelations ? existingRelations.map(r => r.id_typology) : [];

    // Renderizamos pasando los 3 datos necesarios 
    res.render('publications/publicationsEdit', {
        publication,
        typologies: allTypologies || [],
        currentTypologies
    });
});

// Ruta para actualizar una publicación
router.put('/:id', async (req, res) => {
    const id = Number(req.params.id);
    const { title, description, themes, acknowledgment, publication_edition, selectedTypologies } = req.body;
    try {
        // Actualizamos la publicación
        const { error: updateError } = await supabase
            .from('publications')
            .update({ title, description, themes, acknowledgment, publication_edition })
            .eq('id_publication', id);

        if (updateError) throw updateError;

        // Borramos las relaciones existentes
        const { error: deleteError } = await supabase
            .from('publication_typologies')
            .delete()
            .eq('id_publication', id);

        if (deleteError) throw deleteError;

        // Insertamos las nuevas relaciones
        if (selectedTypologies && selectedTypologies.length > 0) {
            const typeIds = Array.isArray(selectedTypologies) ? selectedTypologies : [selectedTypologies];
            // Convertimos los IDs a números
            const insertData = typeIds.map(typeId => ({
                id_publication: id,
                id_typology: parseInt(typeId)
            }));
            // Insertamos las nuevas relaciones
            const { error: insertError } = await supabase
                .from('publication_typologies')
                .insert(insertData);

            if (insertError) throw insertError;
        }

        res.json({ success: true, message: 'Publicació actualitzada correctament!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error intern del servidor' });
    }
});

// Exportar el router para usarlo en index.js
export default router;