    const express = require("express");
    const app = express();
    const mysql = require("mysql2");
    const cors = require("cors")


    app.use(cors());
    app.use(express.json());

    const db = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"sebas123",
        database:"productos"
    });
    db.connect();

    app.post("/create",(req,res)=>{
        const Producto = req.body.Producto
        const Fecha = req.body.Fecha
        const Caducidad = req.body.Caducidad
        const Cantidad = req.body.Cantidad
        const Costo = req.body.Costo

        db.query('INSERT INTO producto(Producto,Fecha,Caducidad,Cantidad,Costo) VALUES(?,?,?,?,?)',[Producto,Fecha,Caducidad,Cantidad,Costo],
        (err,result)=>{
            if(err){
                console.log(err);
            }else{
                res.send("Producto registrado con exito ")
            }
        } 
        );
    });



    app.get("/productos",(req,res)=>{
        db.query('SELECT * FROM producto',
        (err,result)=>{
            if(err){
                console.log(err);
            }else{
                res.send(result)
            }
        } 
        );
    });

    const update = () => {
        console.log("Entrando en la función de actualización");
        console.log("Datos a enviar:", id, Producto, Fecha, Caducidad, Cantidad, Costo);
        
        // Resto del código de la función update...
      }
      

    app.put("/update",(req,res)=>{
        const id = req.body.id;
        const Producto = req.body.Producto;
        const Fecha = req.body.Fecha;
        const Caducidad = req.body.Caducidad;
        const Cantidad = req.body.Cantidad;
        const Costo = req.body.Costo;

        db.query('UPDATE producto SET Producto=?,Fecha=?,Caducidad=?,Cantidad=?,Costo=? WHERE id=?',[Producto,Fecha,Caducidad,Cantidad,Costo,id],
        (err,result)=>{
            if(err){
                console.log(err);
            }else{
                res.send("Producto actualizado con exito ")
            }
        } 
        );
    });

    app.listen(3001,()=>{
        console.log("Corriendo en el puerto 3001")
    })