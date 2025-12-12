// Middleware para verificar si el usuario es Admin o no
export function isAdmin(req, res, next) {
    // Si el usuario no está autenticado, redirigimos a la página de login
    if (!req.session?.user) {
        return res.redirect("/");
    }

    // Si el usuario no es Admin, redirigimos a la página de inicio
    if (req.session.user.level !== "Admin") {
        return res.status(403).send("Accés denegat. Només els administradors poden accedir aquí.");
    }

    next();
}
/*
* Middleware para verificar si el usuario es Admin o Editor
*/
export function isEditor(req, res, next) {
    if (!req.session?.user) {
        return res.redirect("/");
    }

    const validRoles = ["Admin", "Editor"];
    if (validRoles.includes(req.session.user.level)) {
        next();
    } else {
        return res.status(403).json({ success: false, message: "No tens permisos d'edició." });
    }
}
