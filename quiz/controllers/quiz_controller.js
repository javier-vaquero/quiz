var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.findById(quizId).then(
    function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else { next(new Error('No existe quizId=' + quizId)); }
    }
  ).catch(function(error) { next(error);});
};

// GET /quizes/
exports.index = function(req, res) {
	var query = {order: 'pregunta'};
	console.info(req.query.search);
	if(req.query.search) {
		var search = req.query.search.replace(" ", "%");
		query.where = ["pregunta like ?", "%"+search+"%"];
	}
	models.Quiz.findAll(query).then(function(quizes) {
		res.render('quizes/index', {quizes : quizes});
	});
};

// GET /quizes/{id}/question
exports.question = function(req, res) {
	res.render('quizes/question', { quiz: req.quiz});
};
// GET /quizes/{id}/answer
exports.answer = function(req, res) {
	var respuesta = req.query.respuesta === req.quiz.respuesta ? 'Correcto' : 'Incorrecto';
	res.render('quizes/answer', {respuesta : respuesta, quiz : req.quiz});
};