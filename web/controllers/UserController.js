import { UserModel } from "../models/UserModel.js";

export class UserController {
    static async index(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = 15;
            const filters = { search: req.query.search || '' };

            const result = await UserModel.getAll(page, limit, filters);

            res.render("users/users", {
                users: result.data,
                pagination: result,
                currentFilters: filters
            });
        } catch (error) {
            console.error("Error al obtener usuarios:", error);
            res.status(500).send("Error en obtenir usuaris");
        }
    }

    static async formEdit(req, res) {
        const id = Number(req.params.id);
        try {
            const user = await UserModel.getById(id);
            res.render('users/usersEdit', { user });
        } catch (error) {
            return res.status(404).send('Usuari no trobat');
        }
    }

    static async update(req, res) {
        const id = Number(req.params.id);
        const { name, email, password, level } = req.body;

        try {
            await UserModel.update(id, {
                name,
                email,
                password,
                level
            });

            return res.json({ success: true, message: "Usuari actualitzat correctament!" });
        } catch (err) {
            console.error("Error:", err);
            return res.status(500).json({ success: false, message: "Error intern del servidor" });
        }
    }

    static async formCreate(req, res) {
        res.render('users/usersForm');
    }

    static async create(req, res) {
        const { name, email, password, confirmPassword, level } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Nom, email i contrasenya són obligatoris"
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Les contrasenyes no coincideixen"
            });
        }

        try {
            await UserModel.create({
                name,
                email,
                password,
                level
            });

            return res.json({ success: true, message: "Usuari creat correctament!" });
        } catch (err) {
            console.error("Error:", err);
            return res.status(500).json({ success: false, message: "Error intern del servidor" });
        }
    }


    static async delete(req, res) {
        const id = Number(req.params.id);
        try {
            await UserModel.delete(id);
            return res.json({ success: true, message: "Usuari eliminat correctament!" });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Error al eliminar." });
        }
    }
}