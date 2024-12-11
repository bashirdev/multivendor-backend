const sellerModel = require("../../models/sellerModel");

class sellerController{
    get_seller_request=async(req,res)=>{
         const {parPage,page,searchValue} =req.query;
         
         let skipPage=''
         try {
            if(parPage && page){
                skipPage=parseInt(parPage) * (parseInt(page - 1))
                console.log(skipPage)
            }
            if(searchValue && page && parPage){
                const sellers=await sellerModel.find({$text:{$search:searchValue}}).skip(skipPage).limit(parPage).sort({createdAt:-1})
               console.log(seller)
                const totalSeller=await sellerModel.find({$text:{$search:searchValue}}).countDocuments()
                responseReturn(res,200,{sellers,totalSeller}) 
            }else{
                const sellers=await sellerModel.find({})
                const totalSeller=await sellerModel.find({}).countDocuments()
                responseReturn(res,200,{sellers,totalSeller}) 
            }
         } catch (error) {
            console.log(error.message) 
         }
    }
    //method end
    seller_active_deactive=async(req,res)=>{
        console.log(req.body)
    }

}

module.exports=new sellerController();
