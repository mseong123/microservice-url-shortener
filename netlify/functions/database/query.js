const mongoose=require('mongoose');

/*created a simple database query async PLUGIN specifically to deal with serverless function environment (stateless execution). Plugin 
accepts param and a query function as parameters and connects and disconnects from MongoDB server everytime the plugin is run and returns query results as a Promise
(async functions always return a Promise). Use this plugin for all model queries to the database.  

*use async function because no other way to return a value from the query function after database operation runs. If don't use async (and only 
use a normal function), codes will execute as synchronous and there will be no return value from the async database functions.
ie
function query(model){
    mongoose.connect(process.env.MONGO_URI).then(
        (success) => {
            console.log('successfully logged into MongoDB!');
            return success ===>WON'T RETURN TO ORIGINAL CALL!!
        }
    ).catch(error=>{
        console.log(error)
        return error ===>WON'T RETURN TO ORIGINAL CALL!!
    }).finally(
        ()=>mongoose.connection.close()
        )
    
}
*/

/*don't need to wrap connection and query codes inside try catch because any error due to 1) connection to db not successful 2) query not 
successful or 3) logic error or anything else will be capture by the caller code calling .catch() then dealing with it there as reject. If 
want to handle error codes more specifically after it happens here then can use try catch before passing to caller.
*/
async function query(param,method) {
    //try {
        await mongoose.connect(process.env.MONGO_URI);
        const result=await method.call(param);
        await mongoose.connection.close();
        return result;
    /*
    } catch (error) {
        console.log(error)
        throw error;
    }
    */
}

module.exports=query;