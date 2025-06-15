import express from 'express'
import { CheckAuth } from '../middlewares/checkAuth.js'
import { AddProducts, deleteProduct, fetchAllProducts, fetchProductsByCategory, fetchProductStatics, FetchSingleProducts, updateProduct } from '../controllers/Product.controller.js'
import { FetchAdminProfile, UpdateAdminDetails } from '../controllers/Admin.controller.js'

export const ProductRouter = express.Router()

ProductRouter.post('/addproduct',CheckAuth,AddProducts)
ProductRouter.put('/updateproduct/:productId',CheckAuth,updateProduct)
ProductRouter.delete('/deleteproduct/:productId',CheckAuth,deleteProduct)
ProductRouter.get('/fetchproducts',CheckAuth,fetchAllProducts)
ProductRouter.get('/fetchcategoryproducts/:category',CheckAuth,fetchProductsByCategory)
ProductRouter.get('/fetchsingleproduct/:productId',CheckAuth,FetchSingleProducts)
ProductRouter.get('/fetchproductstatic',CheckAuth,fetchProductStatics)
