import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import UserModle from "@/model/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();
    const existingUserVerifiedBtUsername = await UserModle.findOne({
      username,
      isVerified: true,
    });
    if (existingUserVerifiedBtUsername) {
      return Response.json(
        {
          status: false,
          message: "Username already takend",
        },
        { status: 400 }
      );
    }
  const existingUserByEmail = await  UserModel.findOne({email})
  const verifyCode = Math.floor(100000 + Math.random()*9000000).toString()

   if(existingUserByEmail){
    if(existingUserByEmail.isVerified){
  
            return Response.json(
              {
                success: false,
                message: "USER ALREADY EXIST WITH THIS EMAIL"
              },
              { status: 500 })
    } else{
        const hasedPassword = await bcrypt.hash(password, 10)
        existingUserByEmail.password = hasedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry= new Date(Date.now() + 3600000)
        await existingUserByEmail.save()
        

    }

   } else{
   const hasedPassword=  await bcrypt.hash(password, 10)
   //tha const hai par phir bhi next line mein update ho rhi hai expriy date?? so iska answer hai new keyword 
//    In simpler terms, const prevents you from assigning a new object or value to the variable expiryDate, but it doesn't prevent you from modifying the properties or contents of the object that expiryDate refers to.
//memory k ander ek refence pont hai uss k ander change hoti hai

   const expiryDate= new Date()
   expiryDate.setHours(expiryDate.getHours()+1);

  const newUser =  new UserModel({
    username,
    email,
    password: hasedPassword,
   isVerified: false,
    verifyCode,
    verifyCodeExpiry: expiryDate,
    isAcceptingMessage: true,
    messages:[]
   })
   await newUser.save();
   }
   //send verification email
  const emailResponse =  await sendVerificationEmail(email, username, verifyCode);
  if(!emailResponse.success) {
   return Response.json(
     {
       success: true,
       message: emailResponse.message
     },
     { status: 500 }
   )}
   return Response.json(
    {
      suceess: true,
      message: "User register successfully. please verify your email",
    },
    { status: 500 }
  );
  } catch (error) {
    console.log("error registring user", error);
    return Response.json(
      {
        success: false,
        message: "Error registring user",
      },
      {
        status: 500,
      }
    );
  }
}
