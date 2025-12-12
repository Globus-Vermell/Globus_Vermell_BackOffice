import { UserService } from "../services/UserService.js";

export class UserController {
    
    static async index(req, res, next) {
        try {
            const data = await UserService.getAllUsers(req.query);
            res.render("users/index", data);
        } catch (error) {
            next(error);
        }
    }

    static async formCreate(req, res, next) {
        res.render('users/create');
    }

    static async create(req, res, next) {
        try {
            await UserService.createUser(req.body);
            res.json({ success: true, message: "Usuari creat correctament!" });
        } catch (err) {
            next(err);
        }
    }

    static async formEdit(req, res, next) {
        const id = Number(req.params.id);
        try {
            const user = await UserService.getUserById(id);
            res.render('users/edit', { user });
        } catch (error) {
            next(error);
        }
    }

    static async update(req, res, next) {
        const id = Number(req.params.id);
        try {
            await UserService.updateUser(id, req.body);
            res.json({ success: true, message: "Usuari actualitzat correctament!" });
        } catch (err) {
            next(err);
        }
    }

    static async delete(req, res, next) {
        const id = Number(req.params.id);
        try {
            await UserService.deleteUser(id);
            res.json({ success: true, message: "Usuari eliminat correctament!" });
        } catch (error) {
            next(error);
        }
    }
}