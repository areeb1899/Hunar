require('dotenv').config();
const DB=require('./data-source')
const app=require('./app');

const PORT=process.env.PORT || 4000;

(async()=>{
try {
    await DB.connectToDatabase();
    console.log('DB connected');
    app.listen(PORT,()=>{
        console.log('server running on:',PORT);
    })
} catch (error) {
    console.log('Cannot run the server:',error);
}
})();