import express from 'express';
import supabase from '../../config.js';

const router = express.Router();

router.get('/:id', async (req, res) => {
    const id = Number(req.params.id);

    const { data: prize, error } = await supabase
        .from('prizes')
        .select('*')
        .eq('id_prize', id)
        .single();

    if (error || !prize) {
        console.error('Error fetching prize:', error);
        return res.status(404).send('Premi no trobat');
    }

    res.render('prizes/prizesEdit', { prize });
});

router.put('/:id', async (req, res) => {
    const id = Number(req.params.id);
    const { name, tipe, year, description } = req.body;

    try {
        const { error } = await supabase
            .from('prizes')
            .update({ name, tipe, year: year ? parseInt(year) : null, description })
            .eq('id_prize', id);

        if (error) {
            console.error('Error updating prize:', error);
            return res.status(400).json({ success: false, message: 'Error al actualizar el premi' });
        }

        res.json({ success: true, message: 'Premi actualitzat correctament!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error intern del servidor' });
    }
});

export default router;