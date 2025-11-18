import express from 'express';
import supabase from '../../config.js';

const router = express.Router();

router.get('/:id', async (req, res) => {
    const id = Number(req.params.id);

    const { data: protection, error } = await supabase
        .from('protection')
        .select('*')
        .eq('id_protection', id)
        .single();

    if (error || !protection) {
        console.error('Error fetching protection:', error);
        return res.status(404).send('Protecció no trobada');
    }

    res.render('protection/protectionEdit', { protection });
});

router.put('/:id', async (req, res) => {
    const id = Number(req.params.id);
    const { level, description } = req.body;

    try {
        const { error } = await supabase
            .from('protection')
            .update({ level, description })
            .eq('id_protection', id);

        if (error) {
            console.error('Error updating protection:', error);
            return res.status(400).json({ success: false, message: 'Error al actualizar la protecció' });
        }

        res.json({ success: true, message: 'Protecció actualitzada correctament!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error intern del servidor' });
    }
});

export default router;