import express from "express";

import uploadCtrl from "../controllers/uploadCtrl";
import auth from "../middleware/auth";

const router = express.Router();

router.post("/upload", auth, uploadCtrl.uploadImage);

router.post("/destroy", auth, uploadCtrl.deleteImage);

export default router;
