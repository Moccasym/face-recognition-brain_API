const express = require('express');
const { listenerCount } = require('stream');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')

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

// ################### TEST ##################
db.select('*').from('users').then(users => {
    //console.log(users);
});


const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req,res)=>{
    res.send(db.users);
})

// ################## SIGN IN ###################
app.post('/signin', (req,res) =>{
    db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
        .then(data =>{
            const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
            if (isValid){
                return db.select('*').from('users')
                .where('email', '=', req.body.email)
                .then(users => {
                    res.json(users[0])
                })
                .catch(err => res.status(400).json('unable to get users'))
            
            } else {
                res.status(400).json('wrong credentials')
            }
        })
        .catch(err => res.status(400).json('wrong credentials'))
})

// ################## REGISTER ###################
app.post('/register', (req, res)=>{
    const { email, name , password } = req.body;
    const hash = bcrypt.hashSync(password);
    //trx is the transaction parameter
        db.transaction(trx => {
            trx.insert({
                hash: hash,
                email: email
            })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0].email,
                        name: name,
                        joined: new Date()
                    }).then(user => {
                        res.json(user[0]);
                })
            })
            // Do this to add it 
            .then(trx.commit)
            .catch(trx.rollback)
        })
        .catch(err => res.status(400).json('unable to register'))
});

// ################## USER SEARCH ###################
app.get('/profile/:id', (req,res) => {
    const { id } = req.params;
    db.select('*').from('users')
        .where({id})
        .then(users => {
            if (users.length){
                res.json(users[0]);
            } else {
            res.status(404).json('no such user')
            }
        })
        .catch(err => res.status(404).json('error'));
});

// ################## IMAGE INPUT ###################
app.put('/image', (req,res)=>{
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0].entries);
    })
    .catch(err => res.status(400).json('unable to get image'));
})

// #################### NODEMON RESPONSE #####################
app.listen(3000, ()=> {
    console.log('app is runing on port 3000');
});


//################# TODO ###################
/* STEPS TODO
/sign in --> POST = success or fail
/register --> POST = new user object to return
/profile/: userID --> GET = user
/image --> PUT --> user[count] (for ranking of the profiles against each other )
*/





//################ encription with hash ###############

// bcrypt.hash("bacon", null, null, function(err, hash) {
//     // Store hash in your password DB.
// });

// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });


