import express from 'express';
import supabase from '../../config.js';

const router = express.Router();

router.get('/:id', async (req, res) => {
    const id = Number(req.params.id);

    const { data: reform, error } = await supabase
        .from('reform')
        .select('*')
        .eq('id_reform', id)
        .single();

    if (error || !reform) {
        console.error('Error fetching reform:', error);
        return res.status(404).send('Reforma no trobada');
    }

    const { data: architects, error: archError } = await supabase
        .from('architects')
        .select('*');

    if (archError) {
        console.error('Error fetching architects:', archError);
        return res.status(500).send('Error al obtenir arquitectes');
    }

    res.render('reform/reformEdit', { reform, architects });
});

router.put('/:id', async (req, res) => {
    const id = Number(req.params.id);
    const { year, id_architect } = req.body;

    try {
        const { error } = await supabase
            .from('reform')
            .update({
                year: parseInt(year),
                id_architect: parseInt(id_architect)
            })
            .eq('id_reform', id);

        if (error) {
            console.error('Error updating reform:', error);
            return res.status(400).json({ success: false, message: 'Error al actualizar la reforma' });
        }

        res.json({ success: true, message: 'Reforma actualitzada correctament!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error intern del servidor' });
    }
});

export default router;
