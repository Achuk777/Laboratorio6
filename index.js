let express = require('express');
let morgan = require('morgan');
let uuid = require('uuid');

let bodyParser = require('body-parser');
let jsonParser = bodyParser.json();

let app = express();

app.use(function(req, res, next) {
 	res.header("Access-Control-Allow-Origin", "*");
 	res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
 	res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
 	if (req.method === "OPTIONS") {
 		return res.send(204);
 	}
 next();
});


app.use( morgan('dev') );

let blogPosts = [{
	
	id: uuid.v4(),
	titulo: "Primer post",
	contenido: "Este es mi primer post",
	autor: "Arturo",
	fecha: "24/01/2020"

},
{
	id: uuid.v4(),
	titulo: "Segundo post",
	contenido: "Este es mi segundo post",
	autor: "Jhonny",
	fecha: "24/01/2020"
},
{
	id: uuid.v4(),
	titulo: "Tercer post",
	contenido: "Este es mi tercer post",
	autor: "Arturo",
	fecha: "24/01/2020"
}
];

app.get( '/blog-api/comentarios', (req,res) => {
	/*
	let comentarios = [];
	for(let i =0; i < blogPosts.length; i++){
		let comentario = { comentario: null };
		comentario.comentario=blogPosts[i].contenido;
		console.log(blogPosts[i].contenido);
		comentarios.push(comentario);
	}
	*/
	//return element.contenido;

	res.status(200).json(blogPosts);
});

app.get( '/blog-api/comentarios-por-autor', (req,res) => {
	let autor = req.query.autor;
	//console.log(autor);
	if(!autor){
		res.statusMessage = "Acceso inadecuado";
		res.status(406).send();
	}

	let autorComent = blogPosts.filter( (element) => {
		if(element.autor == autor){
			return element;
		}
	});
	
	if(autorComent[0] == null ){
		res.statusMessage = "No existe el autor";
		res.status(404).send();
	}
	else{
		res.status(200).json(autorComent);
	}

});

app.delete( '/blog-api/remover-comentario/:id', (req,res) => {
	let id = req.params.id;
	let i=0;
	let index;
	
	blogPosts.find( (element) =>{
		if(element.id == id){
			index = i;
		}
		i++;
	});

	if(index != undefined){
		blogPosts.splice(index,1);
		return res.status(200).json({});
	}
	else{
		res.statusMessage = "No se encontro el id del comentario";
		return res.status(404).send();
	}
});

app.put( '/blog-api/actualizar-comentario/:id', jsonParser, (req,res) => {
	let id = req.params.id;
	let i=0;
	let index;

	let tituloAdd = req.body.titulo;
	let contenidoAdd = req.body.contenido;
	let autorAdd = req.body.autor;

	console.log(blogPosts);
	if( tituloAdd == '' && autorAdd == '' && contenidoAdd == ''){
		console.log("Fallo");
		res.statusMessage = "Agregar al menos un elemento";
		return res.status(409).send();
	}

	if(id == null){
	 	res.statusMessage = "Favor de proporcionar un id";
		return res.status(406).send();
	}

	blogPosts.find( (element) =>{
		if(element.id == id){
			index = i;
		}
		i++;
	});

	if(index == undefined){
		res.statusMessage = "No se encontro ningun comentario con el id";
		return res.status(406).send();
	} else{
		if( tituloAdd != undefined)
			blogPosts[index].titulo=tituloAdd;
		if( contenidoAdd != undefined)
			blogPosts[index].contenido=contenidoAdd;
		if( autorAdd != undefined)
			blogPosts[index].autor=autorAdd;
		return res.status(200).json(blogPosts[index]);
	}


});

app.post( '/blog-api/nuevo-comentario', jsonParser, (req,res) => {
	//let id = uuid.v4();
	let tituloAdd = req.body.titulo;
	let contenidoAdd = req.body.contenido;
	let autorAdd = req.body.autor;

	//let fecha = Date();


	if( tituloAdd == '' || autorAdd == '' || contenidoAdd == ''){
		res.statusMessage = "Falta uno o mas elementos";
		return res.status(406).json({});
	}

	let nuevoComentario = { id:uuid.v4(), titulo:tituloAdd, contenido:contenidoAdd,  autor:autorAdd, fecha: Date()};
	//console.log(nuevoComentario);
	blogPosts.push(nuevoComentario);
	//console.log(blogPosts);
	
	return res.status(200).json(blogPosts);
});

app.listen(8080,() => {
	console.log("Servidor corriendo en puerto 8080");
});