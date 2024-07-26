import { Router } from "express";
import contractController from "../controllers/contractController";

const contractRoutes = Router();

contractRoutes.post("/", contractController.create );

export default contractRoutes;

