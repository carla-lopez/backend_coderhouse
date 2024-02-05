const fs= require('fs');
const path = require('path');

class ProductManager{
    constructor(filePath){
        this.products = [];
        this.fileName= 'productos.json';//Nombre del archivo donde se guardan los productos
        this.path=filePath || ''; //Ruta para trabajar con el archivo (oprcional)
        this.loadProductsFromFile();//Cargar productos desde el archivo al crear una instancia del ProductManager

    }

    addProduct(productData){
        const{title,description,price,thumbnail,code,stock} = productData;
        if(!this.isProductValid(productData)){ //Verifico si el producto es valido
            console.log('Error: el producto es invalido');
            return;
        }

        if(this.isCodeDuplicate(code)){ //Verifico si ya existe un producto en la lista con el mismo codigo
            console.log(`Error: el producto con el codigo ${code}ya existe`);
            return;
        }

        const newProduct= {
            id: this.generateProductId(),
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        };

        this.products.push(newProduct);
        console.log(`Productos con id ${newProduct.id}adherido satisfactoriamente`);

        this.saveProductsToFile(); //guardar los productos en el archivo despues de agregar uno nuevo
    }

    getProducts(){
        this.loadProductsFromFile();//cargar productos desde el archivo antes de devolverlos
        return this.products;
    }

    getProductsById(id){
        this.loadProductsFromFile();//cargar productos desde el archivo antes de buscar
        const product= this.products.find((p) => p.id ===id);

        if(!product){
            console.log('Error: producto no encontrado');
            return null;
        }

        return product;
    }

    updateProduct(id,updatedFields){
        this.loadProductsFromFile();//Cargar productos desde el archivo antes de actualizar

        const productIndex=this.products.findIndex((p) => p.id === id);

        if(productIndex === -1){
            console.log('Error: producto no encontrado');
            return;
        }

        this.products[productIndex]= {
            ...this.products[productIndex],
            ...updatedFields,
            id,//Mantener el mismo id original
        };

        this.saveProductsToFile();//guardar los productos actualizados en el archivo
        console.log(`Producto con id ${id} actualizado satisfactoriamente`);

    }

    deleteProduct(id){
        this.loadProductsFromFile();//cargar productos desde el archivo antes de eliminar

        const productIndex = this.products.findIndex((p) => p.id === id);

        if(productIndex === -1){
            console.log('Error: producto no encontrado');
            return;
        }

        this.products.splice(productIndex,1);

        this.saveProductsToFile();//Guardar los productos actualizados (con el producto eliminado) en el archivo
        console.log(`Producto con id ${id} eliminado satisfactoriamente`);
    }

    saveProductsToFile() {
        try {
            const data= JSON.stringify(this.products,null,2);
            fs.writeFileSync(this.path + this.fileName,data);//usar this.path para guardar el archivo en la ruta especificada
            console.log('Productos guardados en el archivo satisfactoriamente');
        }catch(error){
            console.log('Error al guardar los productos en el archivo',error.message);
        }
    }

    loadProductsFromFile(){
        try {
            const data= fs.readFileSync(this.path + this.fileName,'utf-8');
            this.products = JSON.parse(data);
            console.log('Productos cargados desde el archivo satisfactoriamente');
        }catch(error){
            if(error.code === 'ENOENT'){
                //Si el archivo no existe,no hay prodcutos guardados aun
                console.log('El archivo de productos no existe. Se creara uno nuevo al guardar el primer producto');

            }else{
                console.log('Error al cargar los productos desde el archivo',error.message);
            }
        }
    }

    generateProductId(){
        let id= 1;

        if(this.products.length > 0){
            const lastProduct = this.products[this.products.length -1];
            id= lastProduct.id +1;
        }

        return id;
    }

    isProductValid(product){
        return (
            product.title &&
            product.description &&
            product.price &&
            product.thumbnail &&
            product.code &&
            typeof product.stock === 'number' //typeof para asegurar que sea un numero
        );
    }

    isCodeDuplicate(code){
        return this.products.some((p) => p.code === code);
    }
}

module.exports=ProductManager;