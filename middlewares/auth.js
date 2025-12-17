/**
 * Middleware IsAdmin
 * Verifica si el usuario es Admin. Si no hay sesión, redirige al login.
 * Si hay sesión pero no es Admin, deniega el acceso.
 * @param {Object} req Petición HTTP
 * @param {Object} res Respuesta HTTP
 * @param {Function} next Función Next
 * @returns {void} 
 */
export function isAdmin(req, res, next) {
    if (!req.session?.user) return res.redirect("/");
    if (req.session.user.level !== "Admin") {
        return res.status(403).send("Accés denegat. Només els administradors poden accedir aquí.");
    }
    next();
}

/**
 * Middleware IsEditor
 * Verifica si el usuario es Admin o Editor.
 * @param {Object} req Petición HTTP
 * @param {Object} res Respuesta HTTP
 * @param {Function} next Función Next
 * @returns {void} 
 */
export function isEditor(req, res, next) {
    if (!req.session?.user) {
        return res.redirect("/");
    }
    const validRoles = ["Admin", "Editor"];
    if (validRoles.includes(req.session.user.level)) {
        return next();
    }
    return res.status(403).send("Accés denegat. Només els administradors i editors poden accedir aquí.");
}