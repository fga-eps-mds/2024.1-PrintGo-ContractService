import { Router } from "express";
import contractController from "../controllers/contractController";

const contractRoutes = Router();

contractRoutes.get("/", contractController.list);
contractRoutes.post("/", contractController.create);
contractRoutes.put("/:id", contractController.edit);
contractRoutes.patch("/:id", contractController.toggleContract);

export default contractRoutes;

