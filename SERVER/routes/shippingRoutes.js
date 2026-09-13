import express from "express";
import {
  getShippingOrders,
  dispatchOrder,
  updateTransitStatus,
  generateManifest,
  addInternalNote,
} from "../controllers/shippingController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { checkPermission } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(authenticate);
router.use(checkPermission("fulfillmentShipping"));

router.get("/orders", getShippingOrders);
router.post("/orders/:id/dispatch", dispatchOrder);
router.put("/orders/:id/transit-status", updateTransitStatus);
router.post("/manifests", generateManifest);
router.post("/orders/:id/notes", addInternalNote);

export default router;
