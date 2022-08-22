const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql');
const port = 3000;
 
// parse application/json
app.use(bodyParser.json());
 
//create database connection
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sharing_vision'
});
 
//connect to database
conn.connect((err) =>{
  if(err) throw err;
  console.log('Mysql Connected...');
});

//MEMBUAT ARTICLE BARU
app.post('/article', (req, res) => {
    if(req.body.title.length < 20)
    {
        res.send({
            "status": 403, 
            "error": "Title must contain min 20 character", 
            "data": null
        });return;
    } 
    if(req.body.content.length < 200)
    {
        res.send({
            "status": 403, 
            "error": "Content must contain min 200 character", 
            "data": null
        });return;
    } 
    if(req.body.category.length < 3)
    {
        res.send({
            "status": 403, 
            "error": "Category must contain min 3 character", 
            "data": null
        });return;
    } 
    if(req.body.status.toUpperCase() != "PUBLISH" && req.body.status.toUpperCase() != "DRAFT" && req.body.status.toUpperCase() != "TRASH")
    {
        res.send({
            "status": 403, 
            "error": "Status must be PUBLISH or DRAFT or TRASH", 
            "data": null
        });return;
    } 
    let data = {
        title: req.body.title, 
        content: req.body.content, 
        category: req.body.category, 
        status: req.body.status.toUpperCase()
    };
    let sql = "INSERT INTO posts SET ?";
    let query = conn.query(sql, data,(err, results) => {
        if(err) throw err;
        res.send({
        });
    });
});

//MENAMPILKAN SELURUH DATA DENGAN PAGING
app.get('/article/:limit/:offset', (req, res) => {
    let sql = "SELECT * FROM posts LIMIT "+req.params.limit+ " OFFSET "+req.params.offset;
    let query = conn.query(sql, (err, results) => {
        if(err) throw err;
        res.send({
            results
        });
    });
});

//GET ARTICLE BY ID
app.get('/article/:id', (req, res) => {
    let sql = "SELECT * FROM posts WHERE id = "+req.params.id;
    let query = conn.query(sql, (err, results) => {
        if(err) throw err;
        res.send({
            results
        });
    });
});


//EDIT ARTICLE BY ID
app.post('/article/:id', (req, res) => {
    if(req.body.title.length < 20)
    {
        res.send({
            "status": 403, 
            "error": "Title must contain min 20 character", 
            "data": null
        });return;
    } 
    if(req.body.content.length < 200)
    {
        res.send({
            "status": 403, 
            "error": "Content must contain min 200 character", 
            "data": null
        });return;
    } 
    if(req.body.category.length < 3)
    {
        res.send({
            "status": 403, 
            "error": "Category must contain min 3 character", 
            "data": null
        });return;
    } 
    if(req.body.status.toUpperCase() != "PUBLISH" && req.body.status.toUpperCase() != "DRAFT" && req.body.status.toUpperCase() != "TRASH")
    {
        res.send({
            "status": 403, 
            "error": "Status must be PUBLISH or DRAFT or TRASH", 
            "data": null
        });return;
    } 
    let sql = "UPDATE posts SET title='"+req.body.title+"', content='"+req.body.content+"', category='"+req.body.category+"', status='"+req.body.status.toUpperCase()+"' WHERE id="+req.params.id;
    let query = conn.query(sql, (err, results) => {
        if(err) throw err;
        res.send({
        });
    });
});

//HAPUS DATA ARTICLE
app.delete('/article/:id', (req, res) => {
    let sql = "DELETE FROM posts WHERE id="+req.params.id+"";
    let query = conn.query(sql, (err, results) => {
        if(err) throw err;
        res.send();
    });
});

app.listen(port, () => {
  console.log(`cli-nodejs-api listening at http://localhost:${port}`)
});