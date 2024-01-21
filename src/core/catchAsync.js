function catchAsync(callback){
    return function(req,res,next){
        callback(req,res,next)
            .catch((error)=>{
                next(error);
            });
        }
    }

module.exports=catchAsync;
