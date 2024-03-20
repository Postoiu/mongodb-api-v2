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
    res.render('dashboard', { documents: databases.databases });
  });
});

router.get('/:database', (req, res, next) => {
  const db = getDb(req.params.database);

  db.listCollections().toArray().then(collections => {
    res.status(200);
    res.render('dashboard', { documents: collections });
  });
})

module.exports = router;
