const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

let isConnected=false;

module.exports = connectToDatabase = () =>{
	if(isConnected){
		console.log('Using exsiting database connection');
		return Promise.resolve();
	}
	
	console.log('using new database connection');
	console.log(`IsConnected :: ${isConnected}`);
	
	
	return mongoose.connect(process.env.DB)
	.then(db=>{
		isConnected = db.connections[0].readyState;
	}).catch(err=>{
		console.log(process.env.DB);
		console.log(err);
	})
};