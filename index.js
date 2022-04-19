var express = require('express')
var bodyParser = require('body-parser')
var app =  express();
var jsonParser = bodyParser.json()
const jwt = require('jsonwebtoken');

const customers = [
    {id:1, name: "John"},
    {id:2, name: "Marie"},
    {id:3, name: "Claire"}
]

function verifyToken(req, res, next){
    const bearerHeader = req.headers['authorization']

    if (typeof bearerHeader !== 'undefined'){
        const bearerToken = bearerHeader.split(' ')[1]
        req.token = bearerToken
        next()
    }else{
        res.status(403).send("Forbidden")
    }
}




//GET Method

//test
app.get ('/', (req,res) => {
    res.send('hello world');
});

app.get ('/api/customers', verifyToken, (req,res) => {
    jwt.verify(req.token, 'secret', (err, authData) =>{
        if(err){
            res.status(403).send("Forbidden")
        }else{
            authData = customers
            res.send(authData);
        }
    })
});

app.get('/api/customers/:id', (req,res) => {
    const customer = customers.find(c => c.id == parseInt(req.params.id));
    if(!customer){
        res.status(404).send('The ID was not found')
    };

    res.send(customer)
})

app.get('/api/login', (req, res) => {
    const customer = {
        //read usernmae from body
        username: req.body.username,
        password: req.body.password
    };

    jwt.sign({user: customer}, "secret", (err, token) =>{
        res.json({
            username: customer.username,
            token: token,
        });
    });
});

//POST Method
app.post('/api/customers', jsonParser, function (req,res) {
    //to add a new customer, input a name
    if(!req.body.name || req.body.name.length < 3){
        //400 bad request
        res.status(400).send('Name is too short');
    };
    //id will be automatically added
    new_id = customers.length + 1

    //response format from server (in json)
    const customer = {
        id: new_id,
        name: req.body.name,
    };
    //adding the new customer
    customers.push(customer);
    res.send(customer);
})

//PUT Method
app.put('/api/customers/:id', jsonParser, (req, res) => {
    const customer = customers.find(c => c.id == parseInt(req.params.id));
    if(!customer){
        res.status(404).send('The ID was not found')
    };

    //input a new name
    if(!req.body.name || req.body.name.length <3){
        //400 bad request
        res.status(400).send('Name is too short');
        return;
    };
    
    customer.name = req.body.name;
    res.send(customer);

})

//DELETE Method
app.delete('/api/customers/:id', (req, res) => {
    const customer = customers.find(c => c.id == parseInt(req.params.id));
    if(!customer){
        res.status(404).send('The ID was not found')
    };

    const index = customers.indexOf(customer)
    customers.splice(index, 1);

    res.send(customers);
})

// app.listen(3000, () => console.log('Listening to port 3000'))
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.warn(`App listneing on ${PORT}`);
})