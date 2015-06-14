//GET /quizes/question
exports.question = function(req, res) {
	res.render('quizes/question', {pregunta: 'Capital de Italia'});
};
//GET /quizes/answer
exports.answer = function(req, res) {
	var respuesta = req.query.respuesta === 'Roma' ? 'Correcto' : 'Incorrecto';
	res.render('quizes/answer', {respuesta: respuesta});
};