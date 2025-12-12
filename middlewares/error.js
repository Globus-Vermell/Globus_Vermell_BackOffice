export const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (err.code === '23505') {
        return res.status(409).json({
            success: false,
            message: "Aquest registre ja existeix."
        });
    }

    if (err.code === '22001') {
        return res.status(400).json({
            success: false,
            message: "Les dades superen la longitud permesa."
        });
    }

    if (err.isOperational) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        });
    }

    console.error('ERROR CRÍTICO:', err);

    return res.status(500).json({
        success: false,
        message: 'Error intern del servidor. Si us plau, contacta amb suport.'
    });
};