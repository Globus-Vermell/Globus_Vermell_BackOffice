import { BuildingService } from "../services/BuildingService.js";

/**
 * Controlador de Edificios
 * Gestiona todas las operaciones CRUD de los edificios.
 */
export class BuildingController {

    /**
     * Método Index
     * Muestra el listado de edificios.
     * @param {Object} req Petición HTTP
     * @param {Object} res Respuesta HTTP
     * @param {Function} next Función Next
     */
    static async index(req, res, next) {
    try {
        const data = await BuildingService.getAllBuildings(req.query);
        res.render("buildings/index", data); 
    } catch (err) {
        next(err);
    }
}

    /**
     * Método EXCLUSIVO para la App (API JSON)
     * Este método no devuelve HTML, solo datos puros.
     */
    static async apiList(req, res, next) {
        try {
            const data = await BuildingService.getAllBuildings(req.query);
            
            res.json({
                success: true,
                buildings: data.buildings, 
            });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }

    /**
     * Método GetOne
     * Obtiene un edificio por su ID.
     * @param {Object} req Petición HTTP
     * @param {Object} res Respuesta HTTP
     * @param {Function} next Función Next
     */
    static async getOne(req, res, next) {
        const id = Number(req.params.id);
        try {
            const { building, related } = await BuildingService.getBuildingById(id);
            res.json({
                success: true,
                building: building,
                architects: related.architects,
                publications: related.publications,
                images: related.images
            });
        } catch (err) {
            next(err);
        }
    }

    /**
     * Método FormCreate
     * Muestra el formulario de creación cargando las opciones necesarias.
     * @param {Object} req Petición HTTP
     * @param {Object} res Respuesta HTTP
     * @param {Function} next Función Next
     */
    static async formCreate(req, res, next) {
        try {
            const formOptions = await BuildingService.getBuildingFormOptions();
            res.render("buildings/create", formOptions);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Método Create
     * Procesa la creación de un nuevo edificio.
     * @param {Object} req Petición HTTP
     * @param {Object} res Respuesta HTTP
     * @param {Function} next Función Next
     */
    static async create(req, res, next) {
        try {
            await BuildingService.createBuilding(req.body);
            res.json({ success: true, message: "Edificació guardada correctament!" });
        } catch (err) {
            next(err);
        }
    }

    /**
     * Método FormEdit
     * Muestra el formulario de edición con los datos del edificio cargados.
     * @param {Object} req Petición HTTP
     * @param {Object} res Respuesta HTTP
     * @param {Function} next Función Next
     */
    static async formEdit(req, res, next) {
        const id = Number(req.params.id);
        try {
            const viewData = await BuildingService.getDataForEdit(id);
            res.render("buildings/edit", viewData);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Método Update
     * Actualiza un edificio existente.
     * @param {Object} req Petición HTTP
     * @param {Object} res Respuesta HTTP
     * @param {Function} next Función Next
     */
    static async update(req, res, next) {
        const id = Number(req.params.id);
        try {
            await BuildingService.updateBuilding(id, req.body);
            res.json({ success: true, message: "Edificació actualitzada correctament!" });
        } catch (err) {
            next(err);
        }
    }

    /**
     * Método Delete
     * Elimina un edificio.
     * @param {Object} req Petición HTTP
     * @param {Object} res Respuesta HTTP
     * @param {Function} next Función Next
     */
    static async delete(req, res, next) {
        const id = Number(req.params.id);
        try {
            await BuildingService.deleteBuilding(id);
            return res.json({ success: true, message: "Edificació eliminada correctament!" });
        } catch (err) {
            next(err);
        }
    }

    /**
     * Método Validate
     * Cambia el estado de validación de un edificio.
     * @param {Object} req Petición HTTP
     * @param {Object} res Respuesta HTTP
     * @param {Function} next Función Next
     */
    static async validate(req, res, next) {
        const id = Number(req.params.id);
        const { validated } = req.body;
        try {
            await BuildingService.validateBuilding(id, validated);
            res.json({ success: true, message: 'Estat de validació actualitzat correctament!' });
        } catch (err) {
            next(err);
        }
    }

    /**
     * Método FilterTypologies
     * Devuelve tipologías basadas en una lista de IDs.
     * @param {Object} req Petición HTTP
     * @param {Object} res Respuesta HTTP
     * @param {Function} next Función Next
     */
    static async filterTypologies(req, res, next) {
        try {
            const typologies = await BuildingService.getTypologiesByPublications(req.query.ids);
            res.json(typologies);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Método Upload
     * Gestiona la subida de imágenes al servidor.
     * @param {Object} req Petición HTTP
     * @param {Object} res Respuesta HTTP
     * @param {Function} next Función Next
     */
    static async upload(req, res, next) {
        try {
            const filePaths = await BuildingService.uploadImages(req.files);
            res.json({ success: true, filePaths });
        } catch (err) {
            next(err);
        }
    }
}