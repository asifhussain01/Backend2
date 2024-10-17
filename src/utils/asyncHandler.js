//method2
const asyncHandler = (requestHandler)=>{
    return (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((err)=>next(err))
        
    }
}


export {asyncHandler}



//methode 1


// const ayncHandler =()=>{}
// const ayncHandler =()=>(fun)=>{}
// const ayncHandler =()=>async(fun)=>{}


    //rapper fn
// const ayncHandler =(fn)=>async(req,res,next)=>{
//     try {
//         await fn(req,res,next)
//     } catch (error) {
//         res.status(err.code||500).json({
//             success:flage,
//             message:err.message
//         })
        
//     }
// }