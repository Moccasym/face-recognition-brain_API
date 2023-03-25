const express = require('express');
const { listenerCount } = require('stream');

const app = express();
app.use(express.json());

const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            email: 'Sally@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    ]
}

app.get('/', (req,res)=>{
    res.send(database.users)
})

app.post('/signin', (req,res) =>{
    if (req.body.email === database.users[0].email && req.body.password === database.users[0].password){
        res.json('success');
    } else {
        res.status(400).json('error logging in ')
    }

    res.json('signin working');
})

app.post('/register', (req, res)=>{
    const { email, name , password } = req.body;
    database.users.push({
            id: '125',
            name: name,
            email: email,
            password: password,
            entries: 0,
            joined: new Date()
        })
        res.json(database.users[database.users.length-1]);
});

app.get('/profile/:id', (req,res)=>{
    const { id } = req.params;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id){
            return res.json(user);
            found = true;
        }    
    });
    if (!found){
        res.status(404).json('no such user');
    }
});

app.put('/image', (req,res)=>{
     const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id){
            found = true;
            user.entries++;
            return res.json(user.entries);
        }    
    });
    if (!found){
        res.status(404).json('no such user');
    }
})

app.listen(3004, ()=> {
    console.log('app is runing on port 3004');
});

/* STEPS TODO
/sign in --> POST = success or fail
/register --> POST = new user object to return
/profile/: userID --> GET = user
/image --> PUT --> user[count] (for ranking of the profiles against each other )
*/