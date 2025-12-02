import supabase from "../config.js";

// Modelo de publicaciones
export class PublicationModel {

    // Método para obtener todas las publicaciones
    static async getAll(page = null, limit = null) {
        let query = supabase
            .from("publications")
            .select("*")
            .order("title");
        if (page && limit) {
            const from = (page - 1) * limit;
            const to = from + limit - 1;
            query = query.range(from, to);
        }
        const { data, count, error } = await query;

        if (error) throw error;
        return {
            data,
            count,
            page: page || 1,
            limit: limit || count,
            totalPages: limit ? Math.ceil(count / limit) : 1
        };
    }

    // Método para obtener una publicación por ID
    static async getById(id) {
        const { data, error } = await supabase
            .from("publications")
            .select("*")
            .eq("id_publication", id)
            .single();

        if (error) throw error;
        return data;
    }

    // Método para obtener los IDs de las tipologías asociadas a una publicación
    static async getTypologiesByPublication(id) {
        const { data, error } = await supabase
            .from('publication_typologies')
            .select('id_typology')
            .eq('id_publication', id);

        if (error) throw error;
        return data.map(r => r.id_typology);
    }

    // Método para crear una publicación y sus relaciones
    static async create(pubData, typologyIds) {
        // 1. Insertamos la publicación
        const { data, error } = await supabase
            .from("publications")
            .insert([pubData])
            .select()
            .single();

        if (error) throw error;

        const newPubId = data.id_publication;

        // 2. Si hay tipologías, insertamos las relaciones
        if (typologyIds && typologyIds.length > 0) {
            const inserts = typologyIds.map(typeId => ({
                id_publication: newPubId,
                id_typology: parseInt(typeId)
            }));

            const { error: relError } = await supabase
                .from("publication_typologies")
                .insert(inserts);

            if (relError) throw relError;
        }

        return true;
    }

    // Método para actualizar una publicación y sus relaciones
    static async update(id, pubData, typologyIds) {
        // 1. Actualizamos la publicación
        const { error: updateError } = await supabase
            .from('publications')
            .update(pubData)
            .eq('id_publication', id);

        if (updateError) throw updateError;

        // 2. Actualizamos las relaciones (Borrar todo y volver a insertar)
        // Primero borramos las existentes
        const { error: deleteError } = await supabase
            .from('publication_typologies')
            .delete()
            .eq('id_publication', id);

        if (deleteError) throw deleteError;

        // Luego insertamos las nuevas si las hay
        if (typologyIds && typologyIds.length > 0) {
            const inserts = typologyIds.map(typeId => ({
                id_publication: id,
                id_typology: parseInt(typeId)
            }));

            const { error: insertError } = await supabase
                .from('publication_typologies')
                .insert(inserts);

            if (insertError) throw insertError;
        }

        return true;
    }

    // Método para eliminar una publicación
    static async delete(id) {
        const { error } = await supabase
            .from("publications")
            .delete()
            .eq("id_publication", id);

        if (error) throw error;
        return true;
    }

    // Método para validar/invalidar una publicación
    static async updateValidation(id, validated) {
        const { error } = await supabase
            .from('publications')
            .update({ validated })
            .eq('id_publication', id);

        if (error) throw error;
        return true;
    }
}