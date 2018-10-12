'use-strict';

require('dotenv').config({path: './variables.env'});
const connectToDatabase = require('./db');
const Note = require('./models/Note');

module.exports.status = (event, context, callback)=>{
	context.callbackWaitsForEmptyEventLoop = false;
	
	return connectToDatabase().then(()=>{
		callback(null,{
			statusCode: 200,
			body: "Successful connection"
		})
	}).catch(err=>
		callback(null,{
			statusCode: err.statusCode || 500,
			headers: {'content-Type': 'text/plain'},
			body: 'Could not create note'
		})
	);
}

module.exports.create = (event, context, callback)=>{
	context.callbackWaitsForEmptyEventLoop = false;
	
	return connectToDatabase()
	.then(()=>{
		console.log(`Event Body Creation :: ${event.body}`)
		Note.create(JSON.parse(event.body))
	})
	.then(note=>
	callback(null,{
		statusCode: 200,
		body: JSON.stringify(note)
	}))
	.catch(err=>
		callback(null,{
			statusCode: err.statusCode || 500,
			headers: {'content-Type': 'text/plain'},
			body: 'Could not create note'
		})
	);
}

module.exports.getOne = (event, context, callback) => {
	context.callbackWaitsForEmptyEventLoop = false;
	
	return connectToDatabase()
	.then(()=>
	Note.findById(event.pathParameters.id)
	)
	.then((note)=>callback(null,{
		statusCode: 200,
		body: JSON.stringify(note)
	}))
	.catch(err=>
		callback(null,{
			statusCode: err.statusCode || 500,
			headers: {'content-Type': 'text/plain'},
			body: 'Could not find the one you are looking for'
		})
	);
}

module.exports.getAll = (event, context, callback) => {
	context.callbackWaitsForEmptyEventLoop = false;
	
	return connectToDatabase()
	.then(()=>
		Note.find()
	)
	.then((notes)=>callback(null,{
		statusCode: 200,
		body: JSON.stringify(notes)
	}))
	.catch(err=>callback(null,{
		statusCode: err.statusCode || 500,
		headers: {'content-Type': 'text/plain'},
		body: 'Could not find any of the items you were looking for'
	}));
}

module.exports.update = (event, context, callback) => {
	context.callbackWaitsForEmptyEventLoop = false;
	
	return connectToDatabase()
	.then(()=>
	Note.findByIdAndUpdate(event.pathParameters.id, JSON.parse(event.body), {new: true})
	)
	.then(note=> callback(null, {
		statusCode: 200,
		body: JSON.stringify(note)
	}))
	.catch(err=>callback(null,{
		statusCode: err.statusCode || 500,
		headers: {'content-Type': 'text/plain'},
		body: 'Could not update the item'
	}));
}

module.exports.delete = (event, context, callback) => {
	context.callbackWaitsForEmptyEventLoop = false;
	
	return connectToDatabase()
	.then(()=>
		Note.findByIdAndRemove(event.pathParameters.id)
	)
	.then(note=> callback(null,{
		statusCode: 200,
		body: JSON.stringify({message: 'Removed note with id: ' + note._id, note: note})
	}))
	.catch(err=>callback(null,{
		statusCode: err.statusCode || 500,
		headers: {'content-Type': 'text/plain'},
		body: 'Could not fetch the notes.'
	}))
}