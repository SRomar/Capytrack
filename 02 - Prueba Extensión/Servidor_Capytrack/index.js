const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql2');
 

const conexion = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'capytrack'
});

app.set('port', process.env.PORT || 3000);
app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.json());   
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/altaProducto', function(req, res){

    console.log(req.body);
    
    var id = req.body.id;
    var nombre = req.body.title;
    var url = req.body.permalink;
    var activo = Boolean(req.body.status);
    var nombrelista = req.body.nombrelista;

    conexion.query('INSERT INTO productos (id, nombre, url, activo, nombre_lista) VALUES (?, ?, ?, ?, ?);', [id, nombre, url, activo,nombrelista], (err,result)=>{
      if(err) throw err;
    });
    
    res.json({
      status: 'success',
      productos: req.body
    });
});


app.post('/altaLista', function(req, res){
    console.log(req.body);
    
    var nombrelista = req.body.nombre;
    
    conexion.query('INSERT INTO listas (nombre) VALUES (?);', nombrelista, (err,result)=>{
      if(err) throw err;
    });
    
    res.json({
      status: 'success',
      productos: req.body
    });
    
});


app.post('/bajaProducto', function(req, res){
    console.log(req.body);

    var categoryID = req.body.id;

    conexion.query('DELETE FROM productos WHERE id = ?;', categoryID, (err,result)=>{
      if(err) throw err;
    });
    
    res.json({
      status: 'success',
      productos: req.body
    });

});


app.post('/bajaLista', function(req, res){
    console.log(req.body);

    var nombrelista = req.body.nombre;

    conexion.query('DELETE FROM productos WHERE nombre_lista = ?;', nombrelista, (err,result)=>{
      if(err) throw err;
    });

    conexion.query('DELETE FROM listas WHERE nombre = ?;', nombrelista, (err,result)=>{
      if(err) throw err;
    });
    
    res.json({
      status: 'success',
      productos: req.body
    });
});
  

app.listen(3000, () => {
    console.log('Server listening on localhost:3000');
});