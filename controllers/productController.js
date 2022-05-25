const fs = require('fs')
const path = require('path');
const productFunctions = require('../models/Products');
const {validationResult} = require('express-validator')

const productsFilePath = path.join(__dirname, '../data/productos.json');
const productos = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const controller = {
  
  products: (req, res) => res.render("products", {productos:productos}),

  productCart: (req, res) => res.render("productCart"),
  
  productDetail: (req, res) => {
    let {idProduct} = req.params;
    let productoBuscado = productFunctions.findPK(idProduct)
    res.render("productDetail", {'productoBuscado' : productoBuscado});
  }, 
  
  
  editProductos: (req, res) => {
    let {idProduct} = req.params;
    let productoBuscado = productFunctions.findPK(idProduct)
    res.render("editProductos", {producto:productoBuscado})
  },
  
  edit: (req, res) => {
    let id = req.params.idProduct
    let nuevaInfo = req.body
    res.redirect("/products")


    
  },

  deleteProduct: (req, res) => {
    let id = req.params.idProduct
    productFunctions.delete(id)
    res.redirect("/products")
  },
  
   
  createProduct: (req, res) => {
    let error = validationResult(req);


    if (error.isEmpty()) {
      let newProduct = {
        ...req.body,
        image: req.file.filename,   
      }
  
      productFunctions.create(newProduct)
  
      res.redirect('/products')
      
    } else res.render("create", {error:error.mapped(), old: req.body})

  },

  createView: (req, res) => { res.render("create")}


};


module.exports = controller;