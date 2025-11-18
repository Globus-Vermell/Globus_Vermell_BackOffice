import express from 'express';
import supabase from '../../config.js';

const router = express.Router();

router.get('/:id', async (req, res) => {
    const id = Number(req.params.id);

    const { data: publication, error } = await supabase
        .from('publications')
        .select('*')
        .eq('id_publication', id)
        .single();

    if (error || !publication) {
        console.error('Error fetching publication:', error);
        return res.status(404).send('Publicació no trobada');
    }

    res.render('publications/publicationsEdit', { publication });
});

router.put('/:id', async (req, res) => {
    const id = Number(req.params.id);
    const { title, description, themes, acknowledgment, publication_edition } = req.body;

    try {
        const { error } = await supabase
            .from('publications')
            .update({ title, description, themes, acknowledgment, publication_edition })
            .eq('id_publication', id);

        if (error) {
            console.error('Error updating publication:', error);
            return res.status(400).json({ success: false, message: 'Error al actualizar la publicació' });
        }

        res.json({ success: true, message: 'Publicació actualitzada correctament!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error intern del servidor' });
    }
});

export default router;