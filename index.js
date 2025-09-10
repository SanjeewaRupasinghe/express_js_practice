import express from "express";
import router from "./route.js";
import multer from "multer";
import { storage } from "./config/multer.js";
import { connectDB } from "./config/db.js";
import Person from "./models/Person.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

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

// ERROR HANDLING
app.use((err, req, res, next) => {
  console.log(err.message);
  console.log(err.stack);
  res.status(500).json({ message: err.message });
});

// synchronize error
app.get("/sync-error", (req, res,next) => {
  try {
    throw new Error("Error");
  } catch (error) {
    next(error);
  }
});

// uncaught error
process.on("uncaughtException", (err) => {
  console.log(err);
  console.log(err.stack);
  process.exit(1);
});

// unhandled error
process.on("unhandledRejection", (err) => {
  console.log(err);
  console.log(err.stack);
  process.exit(1);
});

// Asynchronism error
app.get("/async-error",async (req, res,next) => {
  try {
    await new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Error"));
      }, 1000);
    });
  } catch (error) {
    next(error);
  }
});

// REST API
const products = [
  { id: 1, name: "Product 1", price: 100 },
  { id: 2, name: "Product 2", price: 200 },
  { id: 3, name: "Product 3", price: 300 },
];

// index
app.get("/products", (req, res) => {
  res.status(200).json(products);
});

// store
app.post("/products", (req, res) => {
  const { name, price } = req.body;
  products.push({ name, price });
  res.status(201).json(products);
});

// show
app.get("/products/:id", (req, res) => {
  const product = products.find((product) => product.id == req.params.id);
  console.log(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.status(200).json(product);
});

// update
app.put("/products/:id", (req, res) => {
  const product = products.find((product) => product.id == req.params.id);
  product.name = req.body.name;
  product.price = req.body.price;
  res.status(200).json(product);
});

// destroy
app.delete("/products/:id", (req, res) => {
  const product = products.find((product) => product.id == req.params.id);
  products.splice(products.indexOf(product), 1);
  res.status(200).json(products);
});

const users = [];

// JWT
// register
app.post("/jwt/register", (req, res) => {
  const { password, email } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 10);

  users.push({ password: hashedPassword, email });
  res.send("User registered");
});

// login
app.post("/jwt/login", (req, res) => {
  const { password, email } = req.body;
  const user = users.find((user) => user.email === email);

  if (!user) {
    return res.send("User not found");
  }

  console.log(user);

  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    return res.send("Invalid password");
  }

  const token = jwt.sign({ email }, "secret", { expiresIn: "1h" });
  res.send(token);
});

// dashboard
app.get("/jwt/dashboard", (req, res) => {
  const token = req.header("authorization");

  const decodedToken = jwt.verify(token, "secret");

  if (decodedToken.email) {
    res.send("JWT Dashboard " + decodedToken.email);
  } else {
    res.send("Invalid token");
  }
});

// Session base authentication
// register
app.post("/register", (req, res) => {
  const { password, email } = req.body;
  users.push({ password, email });
  res.send("User registered");
});

// login
app.post("/login", (req, res) => {
  const { password, email } = req.body;
  const user = users.find(
    (user) => user.password === password && user.email === email
  );
  if (!user) {
    return res.send("User not found");
  }
  req.session.user = user;
  res.send("User logged in");
});

// dashboard
app.get("/dashboard", (req, res) => {
  if (req.session.user) {
    res.send("User logged in " + req.session.user.email);
  } else {
    res.send("User not found");
  }
});

// logout
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
