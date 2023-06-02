import express from "express";
import { db,connectToDb } from "./db.js";

const app = express();
app.use(express.json());



app.get('/hello/get', (req,res)=>{
    res.send("hello world!");
});

app.get('/hello/:name', (req,res)=>{
    const {name} = req.params;
    res.send(`Hello World ${name}!!`);
});

app.post('/hello/post', (req,res)=>{
    res.send(`hello world ${req.body.name}!`);
});

app.get('/api/articles/:name', async (req,res) => {
    const {name} = req.params;

    const article = await db.collection('articles').findOne({name});
    if(article){
        res.send(article);
    }
    else{
        res.sendStatus(404);
    }

})

app.put('/api/articles/:name/upvote', async (req,res) => {
    const {name} = req.params;

    await db.collection('articles').updateOne({name}, {
        $inc : {upvote:1},
    });
    const article = await db.collection('articles').findOne({name});
    if(article){
        res.json(article)
    }
    else{
        res.send("That article doesn\'t exist!");
    }
});

app.post('/api/articles/:name/comments', async (req,res) => {
    const {name} = req.params;
    const {postedBy,text} = req.body;

    await db.collection('articles').updateOne({name}, {
        $push : {comments : {postedBy,text}} 
    })
    const article = await db.collection('articles').findOne({name});
    if(article){
        res.send(article);
    }
    else{
        res.send("That article doesn\'t exist!");
    }
});

connectToDb(()=>{
    console.log("Successfully connected to Database");
    app.listen(8000,()=>{
        console.log("Server is listening on port 8000!");
    });
})

