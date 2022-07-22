const mongoose = require ('mongoose');
const MONGO_URL= process.env.MONGO_URL;
mongoose.connection.once('open', async ()=>{
	console.log('MongoDB connection ready!');
});

mongoose.connection.on('error', (err)=>{
	console.error(err);
});

async function mongoConnect(){
  await mongoose.connect(String(MONGO_URL));
}

async function mongoDisconnect(){
  await mongoose.disconnect();
}
async function mongoDisconnect1(){
  await mongoose.connection.close();
}

module.exports = {
  mongoConnect,
  mongoDisconnect,
  mongoDisconnect1,
}
