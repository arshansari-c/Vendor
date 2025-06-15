import { v2 as cloudinary } from 'cloudinary';
import { Product } from '../models/Product.model.js';
import dotenv from 'dotenv'
import { Admin } from '../models/Admin.model.js';
dotenv.config()
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

export const AddProducts = async (req, res) => {
  try {
    const userId = req.user._id;

    const ProductImage = req.files?.ProductImage;
    if (!ProductImage) {
      return res.status(400).json({ message: "ProductImage(s) are required" });
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const images = Array.isArray(ProductImage) ? ProductImage : [ProductImage];

    const uploadedImages = [];

    for (let image of images) {
      if (!allowedTypes.includes(image.mimetype)) {
        return res.status(400).json({ message: "Only JPG, PNG, and WEBP files are allowed" });
      }

      const uploadResult = await cloudinary.uploader.upload(image.tempFilePath);
      uploadedImages.push({
        public_id: uploadResult.public_id,
        url: uploadResult.secure_url
      });
    }

    const { ProductName, Description, Price, OfferPrice, Keywords ,Category,Quantity} = req.body;

    if (!ProductName || !Description || !Price || !OfferPrice || !Keywords||!Category||!Quantity) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let ProductCode;
    let isUnique = false;
    for (let i = 0; i < 10; i++) {
      const code = Math.floor(100000 + Math.random() * 900000);
      const exists = await Product.findOne({ ProductCode: code });
      if (!exists) {
        ProductCode = code;
        isUnique = true;
        break;
      }
    }

    if (!isUnique) {
      return res.status(500).json({ message: "Failed to generate unique product code" });
    }

    const newProduct = new Product({
      ProductName,
      ProductImage: uploadedImages,
      ProductCode,
      Description,
      Price,
      Category,
      OfferPrice,
      Quantity,
      Keywords: Keywords.split(','),
      ListedBy: userId
    });

    await newProduct.save();

    return res.status(200).json({ message: "Product added successfully" });

  } catch (error) {
    console.error("AddProducts error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const { ProductName, Description, Price, OfferPrice, Keywords,Quantity } = req.body;
    if (!ProductName || !Description || !Price || !OfferPrice || !Keywords) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const ProductImage = req.files?.ProductImage;
    if (!ProductImage) {
      return res.status(400).json({ message: "Product image(s) are required" });
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const images = Array.isArray(ProductImage) ? ProductImage : [ProductImage];

    const uploadedImages = [];

    for (let image of images) {
      if (!allowedTypes.includes(image.mimetype)) {
        return res.status(400).json({ message: "Only JPG, PNG, and WEBP files are allowed" });
      }

      const uploadResult = await cloudinary.uploader.upload(image.tempFilePath);
      uploadedImages.push({
        public_id: uploadResult.public_id,
        url: uploadResult.secure_url
      });
    }

    // ✅ Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        ProductName,
        Description,
        Quantity,
        Price,
        OfferPrice,
        Keywords: Keywords.split(','),
        ProductImage: uploadedImages
      },
      { new: true } // 🔁 return updated document
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Invalid Product ID" });
    }

    return res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct
    });

  } catch (error) {
    console.log("UpdateProduct error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ message: "ProductId is required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Invalid Product" });
    }

    // ✅ Optional: delete Cloudinary images
    if (product.ProductImage && product.ProductImage.length > 0) {
      for (let img of product.ProductImage) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    }

    await Product.findByIdAndDelete(productId);

    return res.status(200).json({ message: "Product deleted successfully" });

  } catch (error) {
    console.log("DeleteProduct error:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};
export const fetchAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    return res.status(200).json({
      message: "Products fetched successfully",
      products
    });
  } catch (error) {
    console.log("FetchAllProducts error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const fetchProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    const products = await Product.find({ Category: category });

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found for this category" });
    }

    return res.status(200).json({
      message: "Products fetched successfully",
      products
    });

  } catch (error) {
    console.log("fetchProductsByCategory error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const FetchSingleProducts = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      message: "Product fetched successfully",
      product
    });

  } catch (error) {
    console.log("FetchSingleProducts error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const fetchProductStatics = async (req, res) => {
  try {
    const countProducts = await Product.countDocuments();
    const countUsers = await Admin.countDocuments(); 

    res.status(200).json({
      message: "Statistics fetched successfully",
      totalProducts: countProducts,
      totalUsers: countUsers
    });
  } catch (error) {
    console.log("fetchProductStatics error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};