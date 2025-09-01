import express from "express";
import router from "./route.js";
const app = express();

const PORT = 3000;

// simple route
app.get("/", (req, res) => {
  res.send("Hello World! in express ch");
});

app.use("/", router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
