import express from "express";

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
