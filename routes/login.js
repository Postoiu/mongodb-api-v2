const express = require('express');
const jwt = require('jsonwebtoken');

const { connectToDatabase, getDb } = require('../util/mongodb-util');

const router = express.Router();

router.get('/', function(req, res, next) {
    res.status(200);
    res.render('login');
});

router.post('/auth', (req, res, next) => {

    const username = encodeURIComponent(req.body.username);
    const password = encodeURIComponent(req.body.password);
    const connectionString = `mongodb://${username}:${password}@mongodb-server/?authSource=admin`;

    console.log('Authenticating user...');

    connectToDatabase(connectionString)
    .then(async () => {
        console.log('User authenticated successfuly!');

        const token = jwt.sign({ id: req.body.password }, 'secret', { expiresIn: 86400 });

        res.cookie('accessToken', token);
        res.cookie('user', username, { maxAge: 86400000 });
        res.status(200);

        return res.redirect('/home');
    })
    .catch(err => {
        console.error('Authentication failed!\n', err);
        res.status(401);
        res.send('User credentials don\'t match!');

    })
})

module.exports = router;
