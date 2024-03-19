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
    res.render('index', {
      title: 'Express',
      databases: databases.databases
    });
  });
});

module.exports = router;
