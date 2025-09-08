import express from "express";
import router from "./route.js";
import multer from "multer";
import { storage } from "./config/multer.js";
import { connectDB } from "./config/db.js";
import Person from "./models/Person.js";
import cookieParser from "cookie-parser";
import session from "express-session";

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
app.use(cookieParser());
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);

const users = [];

// Session base authentication
app.post("/register", (req, res) => {
  const { password, email } = req.body;
  users.push({ password, email });
  res.send("User registered");
});

app.post("/login", (req, res) => {
  const { password, email } = req.body;
  const user = users.find((user) => user.password === password && user.email === email);
  if (!user) {
    return res.send("User not found");
  } 
  req.session.user = user;
  res.send("User logged in");
});

app.get("/dashboard", (req, res) => {
  if (req.session.user) {
    res.send("User logged in " + req.session.user.email);
  } else {
    res.send("User not found");
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.send("User logged out");
});

// Session
app.get("/session", (req, res) => {
  req.session.page_views = req.session.page_views ? req.session.page_views : 0;

  req.session.page_views++;
  res.send(`You visited this page ${req.session.page_views} times`);
});
app.get("/session/fetch", (req, res) => {
  console.log(req.session);
  res.send("Session fetched");
});
app.get("/session/remove", (req, res) => {
  req.session.destroy();
  res.send("Session removed");
});

// Cookies
// create
app.get("/cookie", (req, res) => {
  res.cookie("name", "Sanjeewa");
  res.send("Cookie set");
});
// fetch
app.get("/cookie/fetch", (req, res) => {
  console.log(req.cookies);
  res.send("Cookie fetched");
});
// remove
app.get("/cookie/remove", (req, res) => {
  res.clearCookie("name");
  res.send("Cookie removed");
});

// create
app.post("/person", async (req, res) => {
  console.log(req.body);

  try {
    // Destructuring
    const { name, age, email } = req.body;
    // Create new person
    const person = new Person({ name, age, email });
    // Save person
    await person.save();
    console.log(person);
    res.send("Person added");
  } catch (error) {
    console.log(error);
    res.status(500).send(error.errmsg);
  }
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
// app.set("view engine", "ejs");
// app.get("/", (req, res) => {
//   res.render("index", { userName: "Sanjeewa" });
// });

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
