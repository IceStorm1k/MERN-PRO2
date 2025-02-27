import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import { registerValidation , loginValidation, postCreateValidation } from "./validations.js";

import * as UserController from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";

import handleValidationErrors from "./utils/handleValidationErrors.js";
import checkAuth from "./utils/checkAuth.js";


mongoose.connect("mongodb+srv://mekotio:974904180@cluster0.b1air.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0",).then(() => console.log("db ok")).catch((err) => console.log('db error', err));

const app = express();

const storage = multer.diskStorage({
    destination: ( _, __, cb) => {
        cb(null, "uploads");
    },
    filename: ( _, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.post("/login", loginValidation , handleValidationErrors, UserController.login);
app.post("/register", registerValidation , handleValidationErrors, UserController.register);
app.get("/me", checkAuth, UserController.getMe);

app.post("/uploads", checkAuth , upload.single("image"), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne);
app.post("/posts", checkAuth , postCreateValidation , handleValidationErrors, PostController.create);
app.delete("/posts/:id", checkAuth , PostController.remove);
app.patch("/posts/:id", checkAuth , postCreateValidation , handleValidationErrors, PostController.update);



app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log("Server is running on: http://localhost:4444");
})