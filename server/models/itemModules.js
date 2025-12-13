import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true
  },
  initial: {
    type: Number,
    required: true
  },
  sold: {
    type: Number,
    default: 0
  },
  remaining: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    default: "Available"
  },
  itemLocation: {
    type: String,
    required: true
  }
});


const ItemModel = mongoose.model("items", ItemSchema, "items");

export default ItemModel;
