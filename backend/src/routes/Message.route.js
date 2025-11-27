import express from "express";
import {
   deleteMessage,
   getAlluser,
   getMessage,
   markRead,
   sendMessage,
} from "../controllers/messageControllers.js";

const router = express.Router();

router.get("/getalluser", getAlluser);
router.post("/sendmessage/:id", sendMessage);
router.get("/:selectedUserID", getMessage);
router.put("/markread/:selectedUserID", markRead);
router.delete("/delete", deleteMessage);

export default router;
