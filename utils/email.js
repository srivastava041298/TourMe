const nodemailer=require('nodemailer');
const dotenv=require('dotenv');
dotenv.config({path:'./config.env'});
const pug = require('pug');
const postmark=require('postmark');
// const sendGridTransport=require('nodemailer-sendgrid-transport');
const htmlToText = require('html-to-text');


 class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = 'amansrivastava041298@gmail.com';
  }

  newTransport() {
    // if (process.env.NODE_ENV === 'production') {
    //   // Sendgrid
    //   return nodemailer.createTransport({
    //     service: 'SendGrid',
    //     auth: {
    //       user: process.env.SENDGRID_USERNAME,
    //       pass: process.env.SENDGRID_PASSWORD
    //     }
    //   });
    // }

    return nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 465,
       auth: {
        user: "apikey",
        pass:"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"
            }
          });
  }

  // Send the actual email
  async send(template, subject) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject
    });

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html
      
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family!');
  }

  async sendPasswordReset() {
    await this.send(
      'resetPassword',
      'Your password reset token (valid for only 10 minutes)'
    );
  }
};
module.exports=Email;