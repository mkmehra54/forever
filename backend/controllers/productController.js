import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// function to add product
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
    } = req.body;

    // Images uploaded by admin. if we don't write the first part it will throw an error. with both condition, if the any of the image is not uploaded it will be saved as undefined
    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    // filtering out the undefined images, which means the images that are not uploaded by the admin
    const images = [image1, image2, image3, image4].filter(
      (img) => img !== undefined
    );

    // Images can't be saved on the database directly, so we will save the image URLs, which we will get from Cloudinary
    let imagesUrl = await Promise.all(
      images.map(async (img) => {
        const result = await cloudinary.uploader.upload(img.path, {
          resource_type: "image",
        });
        return result.secure_url; // returning the secure URL of the image
      })
    );

    const prouctData = {
      name,
      description,
      price: Number(price), // converting the price to number
      category,
      subCategory,
      sizes: JSON.parse(sizes), // converting the sizes to array
      bestseller: bestseller === "true" ? true : false,
      image: imagesUrl, // saving the image URLs in the database
      date: Date.now(), // saving the date when the product is added
    };

    console.log(prouctData);

    const product = new productModel(prouctData); // creating a new product instance
    await product.save(); // saving the product to the database

    res.json({ success: true, message: "Product added successfully!"});
  } catch (error) {
    console.error(error);
    res.status(500).json({ suuccess:false, message: error.message });
  }
};

// function to list product
const listProduct = async (req, res) => {
  try {
    const products = await productModel.find({}); // fetching all the products from the database
    res.json({success:true, products}); // sending the products as a response
  } catch (error) {
    console.error(error);
    res.status(500).json({ success:false, message: error.message });
  }
};

// function to remove product
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id); // deleting the product by id from the database
    res.json({success: true, message: "Product removed successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// function for single product info
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body; // getting the product id from the query parameters
    const product = await productModel.findById(productId); // fetching the product by id from the database
    res.json({ success: true, product }); // sending the product as a response
  } catch (error) {
    console.error(error);
    res.status(500).json({ success:false, message: error.message });
  }
};

export { addProduct, listProduct, removeProduct, singleProduct };
