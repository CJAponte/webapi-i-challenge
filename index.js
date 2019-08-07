// implement your API here

const express = require('express')
const db = require('./data/db');

const server = express()
server.use(express.json());

server.get('/', (req, res) => {
    res.send('hello world')
})


const port = 8000;
server.listen(port, () => console.log('\napi running\n'))


// | POST   | /api/users     | Creates a user using the information sent inside the `request body`.  
server.post('/api/users', (req, res) => {
    const user = req.body;

    if (user.name && user.bio) {
    console.log('user: ', user)
    db.insert(user)
        .then(idInfo => {
            db.findById(idInfo.id).then(user => {
                res.status(201).json(user)
            })
        })
        .catch(err => {
            res
            .status(500)
            .json({message: "There was an error while saving the user to the database"})
        })
    } else {
        res.status(400).json({message: "Please provide name and bio for the user."})
    }
})

// | GET    | /api/users     | Returns an array of all the user objects contained in the database. 
server.get('/api/users', (req, res) => {
    db.find()
        .then((users)=>{
            res.json(users);
        })
        .catch(err => {
            res
            .status(500)
            .json({message: "The users information could not be retrieved."})
        });
});

// | GET    | /api/users/:id | Returns the user object with the specified `id`. 
server.get('/api/users/:id', (req, res) => {
    const { id } = req.params;
    db.findById(id)
        .then(user => {
            if(user) {
                res.json(user);
            } else{
                res
                .status(404)
                .json({message: "The user with the specified ID does not exist."})
            }
        })
        .catch(err => {
            res
            .status(500)
            .json({message: "The user information could not be retrieved."})
        })
})

// | DELETE | /api/users/:id | Removes the user with the specified `id` and returns the deleted 
server.delete('/api/users/:id', (req, res) => {
    const {id} = req.params;
    db.remove(id)
        .then(count => {
            if (count) {
                res
                //we would ideally like to send back the user
                .json({message: "User was deleted"})
            } else {
                res.status(404).json({message: "The user with the specified ID does not exist."})
            }
        })
        .catch(err => {
        res.status(500).json({message: "The user could not be removed"})
    })
})

// | PUT    | /api/users/:id | Updates the user with the specified `id` using data from the `request body`. Returns the modified document, **NOT the original**. |
server.put('/api/users/:id', (req, res) => {
    const {id} = req.params;
    const user = req.body;
    if (user.name && user.bio){
        db.update(id, user)
            .then(count => {
                if (count){
                    db.findById(id)
                        .then(user => {
                            res.json(user);
                        })
                } else {
                    res
                        .status(404)
                        .json({message: "The user with the specified ID does not exist."});
                }
            })
            .catch(err => {
                res
                    .status(500)
                    .json({message: 'The user information could not be modified.'});
            })
    } else {
        res.status(400).json({message: "Please provide name and bio for the user."})
    }
})