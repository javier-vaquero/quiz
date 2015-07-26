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
		res.render('quizes/index', {quizes : quizes, errors: []});
	});
};

// GET /quizes/{id}/question
exports.question = function(req, res) {
	res.render('quizes/question', { quiz: req.quiz, errors: []});
};
// GET /quizes/{id}/answer
exports.answer = function(req, res) {
	var respuesta = req.query.respuesta === req.quiz.respuesta ? 'Correcto' : 'Incorrecto';
	res.render('quizes/answer', {respuesta : respuesta, quiz : req.quiz, errors: []});
};

// GET /quizes/new
exports.newQuiz = function(req, res) {
	var quiz = models.Quiz.build(
			{pregunta: "", respuesta: ""}
	);
	res.render('quizes/new', {quiz: quiz, errors: []});
};

// POST /quizes/create
exports.create = function(req, res) {
	var quiz = models.Quiz.build( req.body.quiz );
	quiz.validate().then(function(err){
		if (err) {
			res.render('quizes/new', {quiz: quiz, errors: err.errors});
		} else {
			// guarda en DB los campos pregunta y respuesta de quiz
			quiz.save({fields: ["pregunta", "respuesta"]}).then(function(){
				// res.redirect: Redirección HTTP a lista de preguntas
				res.redirect('/quizes');
			});
		}
	});
};

// GET /quizes/:id/edit
exports.edit = function(req, res) {
	// req.quiz: autoload de instancia de quiz
	res.render('quizes/edit', {quiz: req.quiz, errors: []});
};

// GET /quizes/:id/update
exports.update = function(req, res) {
	req.quiz.pregunta  = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.validate().then(function(err){
		if (err) {
			res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
		} else {
			req.quiz.save( {fields: ["pregunta", "respuesta"]}).then( function(){res.redirect('/quizes');});
		}
	});
};