const express = require('express');
const { listenerCount } = require('stream');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
// Knex for connecting the server and the database
const knex = require('knex');

// ################## Controllers ###################
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

// ################## Create database object with knex ###################
const db = knex({
    client: 'pg',
    connection: {
      connectionString : process.env.DATABASE_URL,
      host : process.env.DATABASE_HOST,
      port : 5432,
      user : process.env.DATABASE_USER,
      password : process.env.DATABASE_PW,
      database : process.env.DATABASE_DB
    }
  });

  const app = express();
  app.use(express.json());
  app.use(cors());
  
  // ################## Root ################## 
  app.get('/', (req,res)=>{
      res.send('it is working');
  })

// ################## SIGN IN ###################
app.post('/signin', (req,res) => { signin.handleSignin(req, res, db, bcrypt) })

// ################## REGISTER ###################
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })

// ################## USER SEARCH ###################
app.get('/profile/:id', (req,res) => { profile.handleProfile(req, res, db) });

// ################## IMAGE INPUT ###################
app.put('/image', (req,res) => { image.handleImage(req, res, db) });

// ################## HANDLE IMAGE/FACE RECOGNITION ###################
app.post('/imageurl', (req, res) => { image.handleClarifai (req, res) });

// #################### RESPONSE WHICH PORT #####################
const PORT = process.env.PORT

app.listen(PORT || 3000, ()=> {
    console.log(`app is runing on port ${PORT}`);
});

console.log(PORT)



