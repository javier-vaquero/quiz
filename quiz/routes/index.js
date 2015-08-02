var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', {
		title : 'Quiz',
		errors : []
	});
});

router.get('/author', function(req, res, next) {
	res.render('author', {
		errors : []
	});
});

// Autoload de comandos con :quizId
router.param('quizId', quizController.load);
router.param('commentId', commentController.load); // autoload :commentId

router.get('/quizes', quizController.index);
router.get('/quizes/:quizId(\\d+)', quizController.question);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);

// Gestion:
// Creacion
router.get('/quizes/new', sessionController.loginRequired,
		quizController.newQuiz);
router.post('/quizes/create', sessionController.loginRequired,
		quizController.create);
// Modificacion
router.get('/quizes/:quizId(\\d+)/edit', sessionController.loginRequired,
		quizController.edit);
router.post('/quizes/:quizId(\\d+)/update', sessionController.loginRequired,
		quizController.update);
// Borrar
router.get('/quizes/:quizId(\\d+)/delete', sessionController.loginRequired,
		quizController.destroy);
// Comentarios
router.get('/quizes/:quizId(\\d+)/comments/new', commentController.newComment);
router.post('/quizes/:quizId(\\d+)/comments', commentController.create);
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish',
		sessionController.loginRequired, commentController.publish);
// Sesiones
// Definición de rutas de sesion
router.get('/login', sessionController.newSession); // formulario login
router.post('/login', sessionController.create); // crear sesión
router.get('/logout', sessionController.destroy); // destruir sesión

module.exports = router;
