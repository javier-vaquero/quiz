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
	//Orden de la consulta
	var query = {order: 'pregunta'};
	//Filtros
	var filters = [];
	//Si hay que buscar texto lo añadimos a los filtros
	if(req.query.search) {
		var search = req.query.search.replace(" ", "%");
		filters.push(["pregunta like ?", "%"+search+"%"]);
	}
	//Si hay que buscar por tema lo añadimos a los filtros
	if(req.query.subject) {
		filters.push({tema : req.query.subject});
	}
	if(filters.length) {
		if(filters.length === 2) {
			query.where = Sequelize.and(filters[0],filters[1]);
		} else {
			query.where = filters[0];
		}
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
			{pregunta: "", respuesta: "", tema: ""}
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
			quiz.save({fields: ["pregunta", "respuesta", "tema"]}).then(function(){
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
	req.quiz.tema = req.body.quiz.tema;
	req.quiz.validate().then(function(err){
		if (err) {
			res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
		} else {
			req.quiz.save( {fields: ["pregunta", "respuesta", "tema"]}).then( function(){res.redirect('/quizes');});
		}
	});
};

//DELETE /quizes/:id
exports.destroy = function(req, res) {
	req.quiz.destroy().then(function() {
		res.redirect('/quizes');
	}).catch(function(error){next(error)});
};