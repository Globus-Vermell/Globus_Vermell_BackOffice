import { UserModel } from "../models/UserModel.js";

export class AuthService {
    static async authenticate(username, password) {

        if (!username || !password) {
            throw new Error("Has d'introduir usuari i contrasenya.");
        }

        const user = await UserModel.login(username, password);
        if (!user) {
            throw new Error("Usuari o contrasenya incorrectes.");
        }

        return {
            id: user.id_user,
            name: user.name,
            email: user.email,
            level: user.level
        };
    }
}