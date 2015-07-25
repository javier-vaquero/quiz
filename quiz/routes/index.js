var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Quiz', errors: [] });
});

router.get('/author', function(req, res, next) {
  res.render('author');
});

//Autoload de comandos con :quizId
router.param('quizId', quizController.load);  // autoload :quizId

router.get('/quizes', quizController.index);
router.get('/quizes/:quizId(\\d+)', quizController.question);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);

//Gestion
router.get('/quizes/new',                  quizController.newQuiz);
router.post('/quizes/create',              quizController.create);

module.exports = router;
