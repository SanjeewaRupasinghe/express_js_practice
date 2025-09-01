import express from "express";
import { userWithParameters, userWithQueryParameters } from "./controller.js";

const app = express();

const PORT = 3000;

// simple route
app.get("/", (req, res) => {
  res.send("Hello World! in express ch");
});

app.get("/about", (req, res) => {
  res.send("Hello World! in express ch about");
});

app.get("/contact", (req, res) => {
  res.send("Hello World! in express ch contact");
});

// routes with parameters
app.get("/user/:id", userWithParameters);

// routes with query parameters
// /user?branch=it
app.get("/user", userWithQueryParameters);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
