const express = require('express');
const port = 8030;
const db = require('./config/mongoose');
const  Task  = require('./models/task');
const app = express();
app.use(express.urlencoded());
app.set('view engine', 'ejs');

const mongodb=require('mongodb');
app.get('/todo',function(req,res)
    {
        const todolist=Task.find({}).exec();
        todolist.then(contacts=>{res.render('home',{list_data:contacts})})
                .catch((err)=>console.log('Error'));
    })
app.post('/create-task', function(req, res){
  
  const Todolist=new Promise((resolve,reject)=>{
    Task.create({
        description: req.body.description,
        category: req.body.category ? req.body.category:"******",
        date: req.body.date ? req.body.date:"NO DUE DATE"

  })

  .then(newdata=>{
    console.log('****NEW-DATA INSERTED****',newdata);
    resolve(newdata);
})
.catch(err=>{
    console.log('****OOPS!ERROR IN INSERTING DATA');
    reject(err);
})
});
Todolist.then(data=>res.redirect('back'))
    .catch(err=>console.log('ERROR'));
});
app.get('/delete-task',function(req,res){
    var id = req.query;
    var len = Object.keys(id).length;
    var deletePromises = [];
    for(let i=0; i < len ; i++){
        deletePromises.push(Task.findByIdAndDelete(Object.keys(id)[i]));
    }
    Promise.all(deletePromises).then(()=>{
        return res.redirect('back'); 
    }).catch((err)=>{
        console.log('error in deleting task', err);
        return res.redirect('back');
    });
});

app.listen(port, function(err){
    if(err){
        console.log("ERROR");
    }

    console.log("Server is running at PORT:"+port);
});