const twilio=require("twilio");
require("dotenv").config();


const accountSid=process.env.TWILIO_SID;
const authToken=process.env.TWILIO_AUTH_TOKEN;


const twilioClient=new twilio(accountSid,authToken);
async function sendOtp(otp,phoneNo) {
    try{
   const result= await  twilioClient.messages.create({
            body:`hello this is your otp ${otp}`,
            to:phoneNo,
            from:process.env.TWILIO_PHONE_NO
        });
        return result;
    }
    catch(err){
        return err;
    }
}




module.exports=sendOtp;