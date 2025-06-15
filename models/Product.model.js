import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  ProductName: {
    type: String,
    required: true,
    trim: true
  },
  ProductImage: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      }
    }
  ],
  ProductCode: {
    type: Number,
    required: true,
    unique: true // ✅ Optional: ensures no duplicate codes
  },
  Description: {
    type: String,
    required: true,
    trim: true
  },
  Price: {
    type: Number,
    required: true
  },
  OfferPrice: {
    type: Number,
    required: true
  },
  Category: {
  type: String,
  required: true,
  enum: [
    "Headphones",
    "Electronics",
    "Mobiles",
    "Laptops",
    "Accessories",
    "HomeAppliances",
    "Wearables",
    "Gaming"
  ]
},
Quantity:{
    type : Number,
    required : true
},
  Keywords: {
    type: [String], // ✅ Cleaner: shorthand for array of strings
    required: true
  },
  ListedBy : {
    type : mongoose.Schema.ObjectId,
    ref : "admin"
  }
}, { timestamps: true });

export const Product = mongoose.model("Product", ProductSchema);
