import express from "express";
import router from "./route.js";
import multer from "multer";
import { storage } from "./config/multer.js";
import { connectDB } from "./config/db.js";
import Person from "./models/Person.js";

const app = express();
const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024,
  },
});
const PORT = 3000;

await connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(upload.single("image"));
app.use(express.json());

// create
app.post("/person", async (req, res) => {
  console.log(req.body);

  // Destructuring
  const { name, age, email } = req.body;
  // Create new person
  const person = new Person({ name, age, email });
  // Save person
  await person.save();
  console.log(person);
  res.send("Person added");
});

// update
app.put("/person/:id", async (req, res) => {
  console.log(req.body);

  // Destructuring
  const { name, age, email } = req.body;
  // Create new person
  const person = await Person.findByIdAndUpdate(req.params.id, {
    name,
    age,
    email,
  });
  console.log(person);
  res.send("Person updated");
});

// deleting
app.delete("/person/:id", async (req, res) => {
  console.log(req.body);

  // Create new person
  const person = await Person.findByIdAndDelete(req.params.id);
  console.log(person);
  res.send("Person deleted");
});

app.post("/form", (req, res) => {
  console.log(req.body);
  console.log(req.file);
  res.send("Form submitted");
});

// static
app.use(express.static("public"));

// EJS make as view engine
app.set("view engine", "ejs");
app.get("/", (req, res) => {
  res.render("index", { userName: "Sanjeewa" });
});

// app level middleware
app.use((req, res, next) => {
  console.log("App level Middleware");
  next();
});

// simple route
app.get("/", (req, res) => {
  res.send("Hello World! in express ch");
});

app.get("/error", (req, res) => {
  throw new Error("Error");
});

app.use("/", router);

// error handling middleware
app.use((err, req, res, next) => {
  console.log(err);
  res.send("Error");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
