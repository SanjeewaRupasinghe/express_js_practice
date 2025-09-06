import express from "express";
import router from "./route.js";
const app = express();

const PORT = 3000;

// EJS make as view engine
app.set("view engine", "ejs");
app.get("/", (req, res) => {
  res.render("index", { userName: "Sanjeewa" });
});

// app level middleware
app.use((req,res,next)=>{
  console.log("App level Middleware");
  next();
});

// simple route
app.get("/", (req, res) => {
  res.send("Hello World! in express ch");
});

app.get("/error", (req, res)=>{
  throw new Error("Error");
})

app.use("/", router);

// error handling middleware
app.use((err, req, res, next)=>{
  console.log(err) ;
  res.send("Error");
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
