var models = require('../models/models.js');

// Muestra el listado de estadisticas
exports.show = function(req, res) {
	models.Quiz.findAll({
		include : [ {
			model : models.Comment
		} ]
	}).then(function(quizes) {
		var sin = 0, con = 0, total = 0;
		for (var i = 0; i < quizes.length; i++) {
			var numCom = quizes[i].Comments.length;
			total += numCom;
			if (numCom) {
				con++;
			} else {
				sin++;
			}
		}
		var list = [ {
			txt : "Número de preguntas",
			stat : quizes.length
		}, {
			txt : "Número de comentarios totales",
			stat : total
		}, {
			txt : "Número medio de comentarios por pregunta",
			stat : total/quizes.length
		}, {
			txt : "Número de preguntas sin comentarios",
			stat : sin
		}, {
			txt : "Número de de preguntas con comentarios",
			stat : con
		} ];
		res.render('statistics', {
			list : list,
			errors : []
		});
	});
};