var models = require('../models/models.js');

// GET /quizes/question
exports.question = function(req, res) {
	models.Quiz.findAll().then(function(quiz) {
		res.render('quizes/question', {
			pregunta : quiz[0].pregunta
		});
	});
};
// GET /quizes/answer
exports.answer = function(req, res) {
	models.Quiz.findAll().then(
		function(quiz) {
			var respuesta = req.query.respuesta === quiz[0].respuesta ? 'Correcto' : 'Incorrecto';
			res.render('quizes/answer', {respuesta : respuesta});
		}
	);
};