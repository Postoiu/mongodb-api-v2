const express = require('express');
const jwt = require('jsonwebtoken');

const { connectToDatabase, getDb } = require('../util/mongodb-util');

const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('login');
});

router.post('/auth', (req, res, next) => {

    const username = encodeURIComponent(req.body.username);
    const password = encodeURIComponent(req.body.password);
    const connectionString = `mongodb://${username}:${password}@localhost:27107/?authSource=admin`;

    console.log('Authenticating user...');

    connectToDatabase(connectionString)
    .then(async () => {
        console.log('User authenticated successfuly!');

        const db = getDb('admin');
        const { users } = await db.command({
            usersInfo: req.body.username
        });

        const token = jwt.sign({ id: users[0]._id }, 'secret', { expiresIn: 84600 });
        res.cookie('accessToken', token);

        return res.status(200).redirect('/home');
    })
    .catch(err => {
        console.error('Authentication failed!\n', err);
        res.status(401).send('User credentials don\'t match!');

    })
})

module.exports = router;
