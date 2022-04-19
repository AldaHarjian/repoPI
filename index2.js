var express = require('express')
var bodyParser = require('body-parser')
var app =  express();
var jsonParser = bodyParser.json()
const jwt = require('jsonwebtoken');

const customers = [
    {id:1, name:"John"},
    {id:2, name:"Marie"},
    {id:3, name:"Claire"}
]

//mendapatkan token
app.get('api/login', (req,res) => {
    const customer = {
        //read username from the body
        username: req.body.username,
        password: req.body.password
    };

    jwt.sign({user: customer}, "secret", (err, token) => {
        res.json({
            username: customer.username,
            token: token
        });
    });
});

//verification function
function verifyToken(req, res, next){
    const bearerHeader = req.headers['authorization']

    if(typeof bearerHeader !== 'undefined'){
        const bearerToken = bearerHeader.split(' ')
        req.token = bearerToken    
        next()
    } else {
        res.status(403).send("Forbidden")
    }
}

//GET Data (ambil semua data yang ada)
app.get('/', (req, res) => {
    res.send('Hello World :)');
});

//GET all data
app.get('/api/customers', (req, res) => {
    res.send(customers)
});

//GET id
app.get('/api/customers/:id', (req, res) => {
    const customer = customers.find (c => c.id === parseInt(req.params.id))
    if(!customer){
        //404 not found
        res.status(404).send('The ID was not found')
    }    
    res.send(customer)
});

//GET all params
app.get('/api/customers/:id/:name', (req,res) => {
    res.send(req.params);
})

//POST data (buat data baru)
app.post('/api/customers', jsonParser, function (req,res) {
    if(!req.body.name || req.body.name.length < 3){
        //400 bad request
        res.status(400).send('Please input valid name');
    };

    cur_id = customers.length + 1
    const customer = {
        id: cur_id,
        name: req.body.name,
    };

    customers.push(customer);
    res.send(customer);
})

//PUT data (update data)
app.put('/api/customers/:id', (req, res) => {
    const customer = customers.find(c => c.id === parseInt(req.params.id));
    if (!customer){
        //404 not found
        res.status(404).send('The ID was not found')
    };

    if(!req.body.name || req.body.name.length < 3){
        //400 bad request
        res.status(400).send('Input the valid name');
        return;
    };

    customer.name = req.body.name;
    res.send(customer); 
})

//DELETE data (delete)
app.delete('api/customers/:id', (req,res) => {
    const customer = customers.find(c => c.id === parseInt(req.params.id));
    if (!customer){
        //404 not found
        res.status(404).send('The ID was not found')
    };

    const index = customers.indexOf(customer)
    customers.splice(index, 1);

    res.send(customer);
})

// app.listen(8080, () => console.log ('Listening to port 8080'))

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.warn(`App listneing on ${PORT}`);
})