const adminModel = require("../models/adminModel");
const bcrypt =require('bcrypt');
const { responseReturn } = require("../utiles/response");
const { createToken } = require("../utiles/tokenCreate");
const sellerModel = require("../models/sellerModel");
const sellerCustomerModel = require("../models/chat/sellerCustomerModel");
const formidable = require("formidable")
const cloudinary = require('cloudinary').v2

class AuthControllers{
    admin_login = async(req,res)=>{
        const {email, password} = req.body;
        try {
            const admin= await adminModel.findOne({email}).select('+password')
           
              if(admin){
                const isPasswordMatched=await bcrypt.compare(password, admin.password)
                 if(isPasswordMatched){
                    const token = await createToken({
                        id:admin._id,
                        role:admin.role
                    })
                    res.cookie('accessToken', token, {expires: new Date(Date.now() +7*24*60*60*1000)})
                    responseReturn(res,200, {token, message:'Login Success'})
                 }else{
                    responseReturn(res, 404, {error:"Password Wrong"})
                 }
               
              }else{
                responseReturn(res, 404, {error:"Email not found"})
              }
        } catch (error) {
            responseReturn(res, 500, {error:error.message})
        }
    }
    //End Methode
    //Seller Resigter
    seller_register=async(req,res)=>{
        const {name, email, password} = req.body;
        try {
            
            const getUser=await sellerModel.findOne({email})
            if(getUser){
               responseReturn(res,404, {error:'Email already Exit'})
            }else{
                const seller=await sellerModel.create({
                    name,
                    email,
                    password:await bcrypt.hash(password,10),
                    method:'menualy',
                    shopInfo:{},
                })
               await sellerCustomerModel.create({
                    myId:seller._id,
                })
                const token = await createToken({
                    id:seller.id,
                    role:seller.role
                })
                res.cookie('accessToken', token, {expires: new Date(Date.now() +7*24*60*60*1000)})
              responseReturn(res, 201, {token, message:'Register Success'})
            }
        } catch (error) { 
            responseReturn(res,500, {error:"Internal Server Error"})
        }
    }
// seller Register End
// seller login
 
seller_login = async(req,res) => {
    const {email,password} = req.body;
    try {
        const seller = await sellerModel.findOne({email}).select('+password')
        console.log(seller)
        if (seller) {
            const match = await bcrypt.compare(password, seller.password)
            // console.log(match)
            if (match) {
                const token = await createToken({
                    id : seller._id,
                    role : seller.role
                })
                res.cookie('accessToken',token,{
                    expires : new Date(Date.now() + 7*24*60*60*1000 )
                }) 
                responseReturn(res,200,{token,message: "Login Success"})
            } else {
                responseReturn(res,404,{error: "Password Wrong"})
            }

             
        } else {
            responseReturn(res,404,{error: "Email not Found"})
        }
        
    } catch (error) {
        console.log(error.message)
        responseReturn(res,500,{error: error.message})
    }

}


    getUser= async(req, res)=>{
        const {id, role} = req;
     
        try {
            if(role === 'admin'){
                const user = await adminModel.findById(id)
                responseReturn(res, 200, {userInfo:user})
            }else{
                const seller = await sellerModel.findById(id)
                responseReturn(res, 200, {userInfo:seller})
            }
           
        } catch (error) {
            responseReturn(res,500,{error: error.message})
        }
    } 
    //End getUser Method

    profile_image_upload=async(req,res)=>{
        const {id} = req;
        const form=formidable()
    
            form.parse(req, async(err,_,files)=>{
               
                cloudinary.config({
                    cloud_name: process.env.cloud_name,
                    api_key: process.env.api_key,
                    api_secret: process.env.api_secret,
                    secure: true
                })
                const {image} =files;
                try {
                   const result =await cloudinary.uploader.upload(image.filepath, {folder:'profile'})
                  if(result){
                    await sellerModel.findByIdAndUpdate(id,{image:result.url})
                    const userInfo= await sellerModel.findById({_id:id})
                    responseReturn(res,200,{message:'Profile Image upload Successfully',userInfo})
                  }else{
                    responseReturn(res,404,{message:'Upload failed'})
                  }
              
                } catch (error) {
                    responseReturn(res,500,{error: error.message})
               }
            })
       
    }
    //end Method
    profile_info_add=async(req,res)=>{
      const {id} = req;
      const {  division, district,shopName,sub_district } = req.body;
        try {
           await sellerModel.findByIdAndUpdate(id, {shopInfo:{
            division, district,shopName,sub_district 
           }})
           const userInfo= await sellerModel.findById(id)
                    responseReturn(res,200,{message:'Info Update Successfully',userInfo})
        } catch (error) {
            responseReturn(res,500,{error: error.message})
        }
    }
}

module.exports = new AuthControllers()