/**
 * Middleware ErrorHandler
 * Gestiona los errores de la aplicación.
 * @param {Object} err Objeto de error recibido
 * @param {Object} req Petición HTTP
 * @param {Object} res Respuesta HTTP
 * @param {Function} next Función Next 
 * @returns {void}
 */
export const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Error de duplicidad en base de datos 
    if (err.code === '23505') {
        return res.status(409).json({
            success: false,
            message: "Aquest registre ja existeix."
        });
    }

    // Error de longitud de datos 
    if (err.code === '22001') {
        return res.status(400).json({
            success: false,
            message: "Les dades superen la longitud permesa."
        });
    }

    // Errores operacionales controlados
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        });
    }

    // Errores de programación o desconocidos 
    console.error('ERROR CRÍTICO:', err);

    return res.status(500).json({
        success: false,
        message: 'Error intern del servidor. Si us plau, contacta amb suport.'
    });
};