import express from "express";
import { userWithParameters, userWithQueryParameters } from "./controller.js";
import { login, register } from "./userAuthController.js";

const router = express.Router();

router.get("/about", (req, res) => {
  res.send("Hello World! in express ch about");
});

router.get("/contact", (req, res) => {
  res.send("Hello World! in express ch contact");
});

// routes with parameters
router.get("/user/:id", userWithParameters);

// routes with query parameters
// /user?branch=it
router.get("/user", userWithQueryParameters);

router.get("/user/auth/login", login);
router.get("/user/auth/register", register);


export default router;