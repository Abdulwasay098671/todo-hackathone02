import express from "express";
import bodyParser from "body-parser";
import cors from "cors"
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserS from './model/model.mjs'
import Todo from './model/todomodel.mjs'
import user from "./model/model.mjs";
const app = express();
const PORT = process.env.PORT || 3001


mongoose.connect("mongodb+srv://abdulwasay098671:wasay@cluster0.tuixrch.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    }).then((data) => {
        console.log(`MongoDB Connected With Server ${data.connection.host}`);
    })
app.use(cors({ origin: "*", credentials: true }));

app.use(bodyParser.json());

app.get('/get-user/:id', (req, res) => {
    UserS.findById(req.params.id)
        .then(user => {
            if (!user) {
                return res.status(404).json({ msg: "User not found" });
            }
            res.json({ user: { id: user._id, email: user.email, name: user.name, age: user.age, image: user.image } });
        })
        .catch(err => res.status(500).json({ error: err.message }));
})

app.put('/update-profile/:id', async (req, res) => {
    try {
        const { name, email, age,image } = req.body;

        // Find user by ID
        const user = await UserS.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: "User not found" });

        // Update fields if provided
        if (name) user.name = name;
        if (email) user.email = email;
        if (age) user.age = age;
        if (image) user.image = image;


        // Update password if provided


        await user.save();

        res.json({ msg: "Profile updated successfully", user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/register', async (req, res) => {
    try {
        const { name, email, age, password, image } = req.body;

        // Check if user exists
        const existingUser = await UserS.findOne({ email });
        if (existingUser) return res.status(400).json({ msg: "User already exists" });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save user
        const newUser = new user({ email, password: hashedPassword, age, name, image });
        await newUser.save();

        res.status(201).json({ msg: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await UserS.findOne({ email });
        if (!user) return res.status(400).json({ msg: "User does not exist" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

        // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({ user: { id: user._id, email: user.email } });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.get("/todo/:id", async (req, res) => {
    const product = await Product.findById(req.params.id)
    if (!product) {
        res.status(404).send({
            message: `Product Not Found With ID : ${req.params.id}`
        })
    }
    res.status(200).send({
        succes: true,
        todo
    })
})

app.get("/todo", async (req, res) => {
    const todos = await Todo.find()
    res.status(200).send({
        succes: true,
        todos
    })
})
app.post("/todo", async (req, res) => {
    const todo = await Todo.create({
        title: req.body.title,
        description: req.body.description,
        completed: req.body.completed,
        userId: req.body.userId
    })
    res.status(200).send({
        succes: true,
        todo
    })
})

app.put("/todo/:id", async (req, res) => {
    const todo = await Todo.findByIdAndUpdate({ _id: req.params.id }, {
        title: req.body.title,
        completed: req.body.completed,
        description: req.body.description,
        userId: req.body.userId
    }, {
        new: true
    })
    if (!todo) {
        res.status(404).send({
            message: `Todo Not Found With ID : ${req.params.id}`
        })
    }
    res.status(200).send({
        succes: true,
        todo
    })
})

app.delete("/todo/:id", async (req, res) => {
    const todo = await Todo.findByIdAndDelete({ _id: req.params.id })
    if (!todo) {
        res.status(404).send({
            message: `todo Not Found With ID = ${req.params.id}`
        })
    }
    res.status(200).send({
        succes: true,
        todo
    })
})

app.listen(PORT, () => {
    console.log(`Server is Running on PORT => ${PORT}`);
})