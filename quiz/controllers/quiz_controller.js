var models = require('../models/models.js');

// GET /quizes/
exports.index = function(req, res) {
	models.Quiz.findAll().then(function(quizes) {
		res.render('quizes/index', {quizes : quizes});
	});
};

// GET /quizes/{id}/question
exports.question = function(req, res) {
	models.Quiz.findById(req.params.quizId).then(function(quiz) {
		res.render('quizes/question', {quiz : quiz});
	});
};
// GET /quizes/{id}/answer
exports.answer = function(req, res) {
	models.Quiz.findById(req.params.quizId).then(function(quiz) {
		var respuesta = req.query.respuesta === quiz.respuesta ? 'Correcto' : 'Incorrecto';
		res.render('quizes/answer', {respuesta : respuesta, quiz : quiz});
	});
};