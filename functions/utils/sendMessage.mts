import nodemailer from "nodemailer";

export default function sendMail(email: string, subject: string, desc: string) {
  return new Promise((resolve, reject) => {
    let transporter = nodemailer.createTransport({
      service: process.env.SERVICE,
      auth: {
        type: process.env.TYPE,
        user: process.env.MAIL_SENDER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
      },
    });

    let mailOptions = {
      from: `Events Frontend 🎫 <shubhampatel2024@gmail.com>`,
      to: "s.patel05012003@gmail.com",
      subject: subject,
      html: desc,
    };

    transporter.sendMail(mailOptions, function (err: Error) {
      if (err) {
        console.log(err);
        reject({ success: false, error: err });
      }
      resolve({ success: true });
    });
  });
}
