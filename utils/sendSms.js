const twilio=require("twilio");
require("dotenv").config();
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;
const client = twilio(accountSid, authToken);
async function sendSms(message,to){
  await  client.messages
    .create({
        body: message,
        from: '+13056805257',
        to: to
    })
    .then(message => console.log(message.sid))
    .catch(error=>console.log('Twilio error' ,error));
}

module.exports=sendSms;