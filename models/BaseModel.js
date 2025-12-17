
/**
 * Clase base para modelos que interactúan con la base de datos.
 * Proporciona funciones comunes para operaciones CRUD y paginación.
 */

export default class BaseModel {

    /**
     * Función ApplyPagination
     * Aplica la paginación a una query de Supabase.
     * @param {Object} query - Objeto query de Supabase en construcción.
     * @param {number|null} page - Número de página.
     * @param {number|null} limit - Límite de elementos por página.
     * @returns {Object} La query modificada.
     */
    static applyPagination(query, page, limit) {
        if (page && limit) {
            const from = (page - 1) * limit;
            const to = from + limit - 1;
            return query.range(from, to);
        }
        return query;
    }

    /**
     * Función GetPaginationMetadata
     * Calcula los metadatos de paginación para la respuesta.
     * @param {number} count - Total de registros.
     * @param {number} page - Página actual.
     * @param {number} limit - Límite aplicado.
     * @returns {Object} Objeto con page, limit, totalPages, etc.
     */
    static getPaginationMetadata(count, page, limit) {
        return {
            page: page || 1,
            limit: limit || count,
            totalPages: limit ? Math.ceil(count / limit) : 1,
            count: count,
            totalRecords: count
        };
    }

}