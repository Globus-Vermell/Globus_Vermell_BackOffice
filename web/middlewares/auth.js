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