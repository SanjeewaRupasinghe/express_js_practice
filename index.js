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

// routes with parameters
app.get("/user/:id", (req, res) => {
  const id = req.params.id;
  res.send(`Hello World! in express ch user id: ${id}`);
});

// routes with query parameters
// /user?branch=it
app.get("/user", (req, res) => {
  const keywords = req.query.branch;
  res.send(`Hello World! in express ch user id: ${keywords}`);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
