//External Dependencies
const nodemailer = require("nodemailer");
const createHttpError = require("http-errors");

//Internal Dependencies
const { smtpUsername, smtpPassword } = require("../../secret");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: smtpUsername,
    pass: smtpPassword,
  },
});

const useEmail = async (emailBody) => {
  try {
    const emailOptions = {
      from: smtpUsername, // sender address
      to: emailBody.email, // list of receivers
      subject: emailBody.subject, // Subject line
      html: emailBody.html, // html body
    };
    const info = await transporter.sendMail(emailOptions);
    console.log(`email send successfully ${info.response}`);
  } catch (error) {
    console.log(`there was error on email send : ${error}`);
    throw error;
  }
};

const sendEmail = async ({ preparedEmail, options }) => {
  let successMsg = !options.successMsg
    ? "email sent successfuly"
    : options.successMsg;
  let errorMsg = !options.errorMsg ? "failed to send email" : options.errorMsg;
  try {
    await useEmail(preparedEmail);
    console.log(successMsg);
  } catch (error) {
    throw createHttpError(500, errorMsg);
  }
};



//email design template
const verificationEmailTemplate = (user,link)=>{
  return `
  <div style="width: 80%; max-width: 500px; margin: 0 auto; font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;">
  <div style="width: 70%;  margin: 0 auto">
    <img
      style="width: 100%;  object-fit: contain"
      src="https://res.cloudinary.com/dxs9u7pqc/image/upload/v1718371023/ecommerce/privet/krhfc4xboovndkdvx0zj.png"
      alt="signup"
    />
  </div>
  <h2
    style="
      text-align: center;
      text-transform: capitalize;
      font-size: 22px;
      font-weight: 600;
      color: #40a578;
      padding: 14px 0;
    "
  >
    thank you for register!
  </h2>

  <h4 style="font-size: 17px; text-transform: capitalize">hi ${user},</h4>
  <p style="font-size: 14px; text-transform: capitalize">
    Thank You for signing. you have to
    activate your account to loggedin. follow the link below to activation.
  </p>

  <a
    href="${link}"
    style="
      text-decoration: none;
      display: block;
      margin: 30px auto;
      width: max-content;
      padding: 10px 40px;
      background-color: #ff6366;
      color: #fff;
      text-transform: uppercase;
      font-size: 15px;
    "
    >activate?</a
  >
</div>

  
  `
}

const resetEmailTemplate = (user,link)=>{
  return `
<div style="width: 80%; max-width: 500px; margin: 0 auto; font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;">
  <div style="width: 70%;  margin: 0 auto">
    <img
      style="width: 100%;  object-fit: contain"
      src="https://res.cloudinary.com/dxs9u7pqc/image/upload/v1718432514/ecommerce/privet/dqryp74t30spfkdqunsd.png"
      alt="signup"
    />
  </div>
  <h2
    style="
      text-align: center;
      text-transform: capitalize;
      font-size: 22px;
      font-weight: 600;
      color: #40a578;
      padding: 18px 0;
    "
  >
    reset your password?!
  </h2>

  <h4 style="font-size: 17px; text-transform: capitalize">hi ${user},</h4>
  <p style="font-size: 15px; text-transform: capitalize">
   you have request to reset you password.please click on the link below to reset your password.</p>

  <a
    href="${link}"
    style="
      text-decoration: none;
      display: block;
      margin: 30px auto;
      width: max-content;
      padding: 10px 40px;
      background-color: #ff6366;
      color: #fff;
      text-transform: uppercase;
      font-size: 15px;
    "
    >reset?</a
  >
</div>

  `
}


module.exports = { sendEmail,verificationEmailTemplate ,resetEmailTemplate};
