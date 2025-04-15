const mongoose = require('mongoose');
const initData  = require('./data (3).js');
const Listing = require('../models/listing.js');

main().then(()=>{
    console.log('connected to DB');
})
.catch(err => console.log(err));

async function main() {
  try{
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust',{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  
});
// console.log('connected to DB');
  }catch(err){
    console.errro('Error connecting to DB:',err);
  } 
}
const initDB =async() =>{
  try{
   await Listing.deleteMany({});
   initData.data = initData.data.map((obj)=>({
    ...obj,
    owner:'6745ae64a98b7e34a4e2bc33',
   }));
    await Listing.insertMany(initData.data);
    console.log('data was initialized');
}catch(err){
  console.error('Error initializing data:',err);  
}
};
initDB();