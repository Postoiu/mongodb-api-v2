const { Router } = require('express');

const verifyToken = require('../middlewares/verifyToken');
const { getDb } = require('../util/mongodb-util');

const router = Router();

router.use(verifyToken);
/* GET home page. */
router.get('/', function(req, res, next) {
  const db = getDb('admin');

  db.admin().listDatabases()
  .then((databases) => {
    res.status(200);
    res.render('dashboard', { databases: databases.databases });
  })
  .catch(err => {
    res.redirect(401, 'back');
  });
});

router.post('/create-database', async (req, res, next) => {
  const db = getDb(req.body.dbName);
  const collections = req.body.collections.trim().split(',');

  try {
    for(let collection of collections) {
      await db.createCollection(collection);

      console.log(`Collection ${collection} created successfuly.`);
    }

    res.redirect('/');
  } catch(err) {
    return next(err);
  }
})

router.get('/delete-database', async (req, res, next) => {
  const db = getDb(req.query.dbName);

  try {
    await db.dropDatabase();
    console.log(`Database ${db.databaseName} deleted!`);

    res.redirect('/')
  } catch(err) {
    return next(err);
  }
})

router.post('/create-collection', async (req, res, next) => {
  const db = getDb(req.body.dbName);
  const collectionName = req.body.collectionName;

  try {
    await db.createCollection(collectionName);
    res.redirect(`${req.body.dbName}`);
  } catch(err) {
    return next(err);
  }
})

router.get('/delete-collection', async (req, res, next) => {
  const dbName = req.query.db;
  const db = getDb(dbName);
  const collectionName = req.query.name;

  try {
    await db.dropCollection(collectionName);
    console.log(`Collection ${collectionName} removed!`);

    res.redirect(`${db.databaseName}`);
  } catch(err) {
    return next(err);
  }
})

router.get('/:database', (req, res, next) => {
  const db = getDb(req.params.database);

  db.listCollections().toArray()
  .then(collections => {
    res.status(200);
    res.render('collections', { database: req.params.database, collections });
  })
  .catch(err => {
    next(err);
  });
})

router.get('/:database/:collection', (req, res, next) => {
  const db = getDb(req.params.database);
  const collection = db.collection(req.params.collection);

  collection.find().toArray()
  .then(documents => {
    res.status(200);
    res.render('documents', {collection: req.params.collection, documents});
  })
  .catch(err => {
    next(err);
  });;
})

module.exports = router;
