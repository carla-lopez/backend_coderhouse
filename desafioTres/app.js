const express = require('express');
const fs= require('fs');
const ProductManager= require('./desafioTres');

const app= express();
const productManager= new ProductManager();

//Endpoint para obtener todos los productos o numero limitado de productos

app.get('/products' , async(req,res) => {
    try{
        const limit = parseInt(req.query.limit);//Obtener el parametro de limite desde el query string
        const products = await productManager.getProducts();

        if(!isNaN(limit)){
            //Si se proporciona un limite valido,devolver solo los primeros "Limit" productos
            res.json(products.slice(0,limit));
        }else{
            //Si no se proporciona el limite o es invalido,devolver todos los productos
            res.json(products);
        }

    }catch(error){
        res.status(500).json({error: 'Error al obtener los productos'});
    }
});

//Endpoint para obtener un producto por su ID
app.get('/products/:pid',async(req,res)=> {
    try {
        const productId = parseInt(req.params.pid);
        const product = await productManager.getProductsById(productId);

        if(!product){
            res.status(404).json({error: 'Producto no encontrado'});
        }else{
            res.json(product);
        }
    }catch(error){
        res.status(500).json({error: 'Error al obtener el producto'});
    }
});

const PORT = 3000; //podria utilizar por ejemplo "const PORT= process.env.PORT || 3000;" para que sea un valor de puerto mas dinamico
app.listen(PORT,() => {
    console.log(`Servidor express escuchado en http://localhost:${PORT}`);
});

/*Manejo de CORS: podria agregar middleware para manejar CORS si se planea consumir los endpoints desde un dominio diferente al del servidor
ejemplo: 
const cors= require('cors');
app.use(cors());

Manejo de rutas estaticas: si voy a servir archivos estaticos (ej imagenes) puedo usar 'express.static' para configurar la ruta
ejemplo:
app.use('/public',express.static('publico'));
*/