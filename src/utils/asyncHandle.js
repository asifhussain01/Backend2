//method2
const ayncHandler = (requestHandler)=>{
    (res,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((err)=>next(err))
        
    }
}



export {ayncHandler}



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