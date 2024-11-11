const twilio=require("twilio");
const accountSid = 'AC80893002dcfa20bfd8b5bc032f621181';
const authToken = '7fd97f2351b57784c51db475ee9104f2';
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