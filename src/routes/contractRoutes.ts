import { Router } from "express";
import contractController from "../controllers/contractController";
import logger from "../middleware/logger";

const contractRoutes = Router();

// Aplicar o middleware de log a todas as rotas de contrato
contractRoutes.use(logger);

contractRoutes.get("/", contractController.list);
contractRoutes.post("/", contractController.create);
contractRoutes.put("/:id", contractController.edit);
contractRoutes.patch("/:id", contractController.toggleContract);

export default contractRoutes;

