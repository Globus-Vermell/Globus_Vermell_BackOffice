import { PrizeService } from "../services/PrizeService.js";

export class PrizeController {
    
    static async index(req, res, next) {
        try {
            const prizes = await PrizeService.getAllPrizes(req.query);
            res.render("prizes/index", { prizes, currentFilters: { search: req.query.search || '' } });
        } catch (error) {
            next(error);
        }
    }

    static async formCreate(req, res, next) {
        res.render("prizes/create");
    }

    static async create(req, res, next) {
        try {
            await PrizeService.createPrize(req.body);
            res.json({ success: true, message: "Premi guardat correctament!" });
        } catch (err) {
            next(err);
        }
    }

    static async formEdit(req, res, next) {
        const id = Number(req.params.id);
        try {
            const prize = await PrizeService.getPrizeById(id);
            res.render('prizes/edit', { prize });
        } catch (error) {
            next(error);
        }
    }

    static async update(req, res, next) {
        const id = Number(req.params.id);
        try {
            await PrizeService.updatePrize(id, req.body);
            res.json({ success: true, message: 'Premi actualitzat correctament!' });
        } catch (err) {
            next(err);
        }
    }

    static async delete(req, res, next) {
        const id = Number(req.params.id);
        try {
            await PrizeService.deletePrize(id);
            res.json({ success: true, message: "Premi eliminat correctament!" });
        } catch (error) {
            next(error);
        }
    }
}