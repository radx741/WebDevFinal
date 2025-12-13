import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import UserModel from './models/userModules.js';
import ItemModel from './models/itemModules.js';
import OrderModel from './models/orderModel.js';


dotenv.config();

const app = express();


app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    credentials: true
}));

app.use(express.json());

try {
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log('Inventory Management Connected');
} catch (error) {
    console.log('Failed to connect to Database: ' + error);
}


app.post('/login', async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const pwd_match = await bcrypt.compare(req.body.password, user.password);
        if (!pwd_match) return res.status(401).json({ message: "Invalid email or password" });

        res.status(200).json({ user, message: "Login successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});


app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hash_password = await bcrypt.hash(password, 10);
        const user = await UserModel.findOne({ email });

        if (!user) {
            const new_user = new UserModel({ name, email, password: hash_password });
            await new_user.save();
            res.send({ message: "User Added..." });
        } else {
            res.status(500).json({ message: "User already exists..." });
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get("/items", async (req, res) => {
    try {
        const items = await ItemModel.find({});
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: "Error fetching items", error });
    }
});


app.get("/orders", async (req, res) => {
    try {
        const orders = await OrderModel.find({});
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error });
    }
});


app.get("/", (req, res) => {
    res.send("Inventory Management Server is running...");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server connected at port ${PORT}`);
});
