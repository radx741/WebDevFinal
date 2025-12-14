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


app.post("/items", async (req, res) => {
    try {
        const { itemName, initial, sold, itemLocation } = req.body;
        const remaining = Math.max(0, (initial || 0) - (sold || 0));
        const status = remaining > 0 ? 'Available' : 'Out of Stock';

        const newItem = new ItemModel({
            itemName,
            initial: initial || 0,
            sold: sold || 0,
            remaining,
            status,
            itemLocation
        });

        await newItem.save();
        res.status(201).json({ message: "Item created successfully", item: newItem });
    } catch (error) {
        res.status(500).json({ message: "Error creating item", error });
    }
});


app.put("/items/:id", async (req, res) => {
    try {
        const itemId = req.params.id;
        const { itemName, initial, sold, itemLocation } = req.body;

        const remaining = Math.max(0, (initial || 0) - (sold || 0));
        const status = remaining > 0 ? 'Available' : 'Out of Stock';

        const updatedItem = await ItemModel.findByIdAndUpdate(
            itemId,
            {
                itemName,
                initial: initial || 0,
                sold: sold || 0,
                remaining,
                status,
                itemLocation
            },
            { new: true }
        );

        if (!updatedItem) {
            return res.status(404).json({ message: "Item not found" });
        }

        res.status(200).json({ message: "Item updated successfully", item: updatedItem });
    } catch (error) {
        res.status(500).json({ message: "Error updating item", error });
    }
});


app.delete("/items/:id", async (req, res) => {
    try {
        const itemId = req.params.id;
        const deletedItem = await ItemModel.findByIdAndDelete(itemId);

        if (!deletedItem) {
            return res.status(404).json({ message: "Item not found" });
        }

        res.status(200).json({ message: "Item deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting item", error });
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


app.post("/orders", async (req, res) => {
    try {
        const newOrder = new OrderModel(req.body);
        await newOrder.save();

        if (req.body.payment === 'Paid') {
            const item = await ItemModel.findOne({ itemName: req.body.item });
            if (item) {
                const newRemaining = Math.max(0, item.remaining - (req.body.itemNumber || 1));
                const newSold = item.sold + (req.body.itemNumber || 1);
                await ItemModel.findByIdAndUpdate(item._id, {
                    remaining: newRemaining,
                    sold: newSold,
                    status: newRemaining === 0 ? 'Out of Stock' : 'Available'
                });
            }
        }

        res.status(201).json({ message: "Order created successfully", order: newOrder });
    } catch (error) {
        res.status(500).json({ message: "Error creating order", error });
    }
});


app.put("/orders/:id", async (req, res) => {
    try {
        const orderId = req.params.id;
        const existingOrder = await OrderModel.findById(orderId);

        if (!existingOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        const oldPayment = existingOrder.payment;
        const newPayment = req.body.payment;
        const oldItemNumber = existingOrder.itemNumber || 1;
        const newItemNumber = req.body.itemNumber || 1;
        const oldItemName = existingOrder.item;
        const newItemName = req.body.item;


        if (oldPayment === 'Unpaid' && newPayment === 'Paid') {
            const item = await ItemModel.findOne({ itemName: newItemName });
            if (item) {
                const newRemaining = Math.max(0, item.remaining - newItemNumber);
                const newSold = item.sold + newItemNumber;
                await ItemModel.findByIdAndUpdate(item._id, {
                    remaining: newRemaining,
                    sold: newSold,
                    status: newRemaining === 0 ? 'Out of Stock' : 'Available'
                });
            }
        }

        else if (oldPayment === 'Paid' && newPayment === 'Unpaid') {
            const item = await ItemModel.findOne({ itemName: oldItemName });
            if (item) {
                const newRemaining = item.remaining + oldItemNumber;
                const newSold = Math.max(0, item.sold - oldItemNumber);
                await ItemModel.findByIdAndUpdate(item._id, {
                    remaining: newRemaining,
                    sold: newSold,
                    status: newRemaining > 0 ? 'Available' : 'Out of Stock'
                });
            }
        }

        else if (oldPayment === 'Paid' && newPayment === 'Paid') {

            if (oldItemName !== newItemName || oldItemNumber !== newItemNumber) {
                const oldItem = await ItemModel.findOne({ itemName: oldItemName });
                if (oldItem) {
                    const restoredRemaining = oldItem.remaining + oldItemNumber;
                    const restoredSold = Math.max(0, oldItem.sold - oldItemNumber);
                    await ItemModel.findByIdAndUpdate(oldItem._id, {
                        remaining: restoredRemaining,
                        sold: restoredSold,
                        status: restoredRemaining > 0 ? 'Available' : 'Out of Stock'
                    });
                }


                const newItem = await ItemModel.findOne({ itemName: newItemName });
                if (newItem) {
                    const newRemaining = Math.max(0, newItem.remaining - newItemNumber);
                    const newSold = newItem.sold + newItemNumber;
                    await ItemModel.findByIdAndUpdate(newItem._id, {
                        remaining: newRemaining,
                        sold: newSold,
                        status: newRemaining === 0 ? 'Out of Stock' : 'Available'
                    });
                }
            }
        }

        const updatedOrder = await OrderModel.findByIdAndUpdate(orderId, req.body, { new: true });
        res.status(200).json({ message: "Order updated successfully", order: updatedOrder });
    } catch (error) {
        res.status(500).json({ message: "Error updating order", error });
    }
});


app.delete("/orders/:id", async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await OrderModel.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }


        if (order.payment === 'Paid') {
            const item = await ItemModel.findOne({ itemName: order.item });
            if (item) {
                const newRemaining = item.remaining + (order.itemNumber || 1);
                const newSold = Math.max(0, item.sold - (order.itemNumber || 1));
                await ItemModel.findByIdAndUpdate(item._id, {
                    remaining: newRemaining,
                    sold: newSold,
                    status: newRemaining > 0 ? 'Available' : 'Out of Stock'
                });
            }
        }

        await OrderModel.findByIdAndDelete(orderId);
        res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting order", error });
    }
});


app.get("/", (req, res) => {
    res.send("Inventory Management Server is running...");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server connected at port ${PORT}`);
});
