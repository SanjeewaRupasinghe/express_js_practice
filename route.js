import express from "express";
import { userWithParameters, userWithQueryParameters } from "./controller.js";
import {
  login,
  multiParams,
  multiParamsWithRegex,
  register,
  user,
  userDelete,
  userPut,
} from "./userAuthController.js";

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

// HTTP methods
router.post("/user/auth/user", express.json(), user);
router.put("/user/auth/user/:id", express.json(), userPut);
router.delete("/user/auth/user/:id", userDelete);

// multi params
router.get("/user/auth/:user/:id", multiParams);
router.get("/user/regex/:user/:id", express.json(), multiParamsWithRegex);

export default router;
