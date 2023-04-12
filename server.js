const express = require('express');
const { listenerCount } = require('stream');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

// ################## Create database object with knex ###################
const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user : 'Felix',
      password : '',
      database : 'smart-brain'
    }
  });

  const app = express();
  app.use(express.json());
  app.use(cors());
  
  app.get('/', (req,res)=>{
      res.send(db.users);
  })

// ################## SIGN IN ###################
app.post('/signin', (req,res) => { signin.handleSignin(req, res, db, bcrypt) })

// ################## REGISTER ###################
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })

// ################## USER SEARCH ###################
app.get('/profile/:id', (req,res) => { profile.handleProfile(req, res, db) });

// ################## IMAGE INPUT ###################
app.put('/image', (req,res) => { image.handleImage(req, res, db) });

app.post('/imageurl', (req, res) => { image.handleClarifai (req, res) });

// #################### NODEMON RESPONSE #####################

app.listen(3000, ()=> {
        console.log(`app is runing on port 3000`);
    });

//Making Port dynamics
// const PORT = process.env.PORT

// app.listen(PORT, ()=> {
//     console.log(`app is runing on port ${process.env.PORT}`);
// });

// console.log(PORT)



