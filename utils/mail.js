
const nodemailer = require("nodemailer");

require("dotenv").config();




async function sendMail(mailOptions) {
  try {
   
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user:process.env.EMAIL,
        pass:process.env.PASS
      },
    });

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (err) {
    return err;
  }
}

module.exports=sendMail;