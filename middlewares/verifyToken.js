const jwt = require('jsonwebtoken');

const { connectToDatabase } = require('../util/mongodb-util');

const verifyToken = (req, res, next) => {
    const user = req.cookies?.user;
    const token = req.cookies?.accessToken;

    if(!token) {
        console.log('No token provided!');
        res.status(403)
        return res.redirect('/login');
    }

    jwt.verify(token, 'secret', (err, decoded) => {
        if(err) {
            console.log('Unauthorized!');
            res.status(401)
            return res.redirect('/login');
        }

        const pass = encodeURIComponent(decoded.id);

        const connectionString = `mongodb://${user}:${pass}@mongodb-server/?authSource=admin`;

        connectToDatabase(connectionString)
        .then(async () => {
            console.log('User authenticated successfuly!');
            next();
        })
        .catch(err => {
            console.error('Authentication failed!\n', err);
            res.status(401);
            return res.redirect('/login');
        })
    })
}

module.exports = verifyToken;