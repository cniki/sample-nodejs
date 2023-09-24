
import { createTransport } from "nodemailer";

export const sendEmail = async (to, subject, text) => {
    const transport = createTransport({
        host: process.env.STMP_HOST,
        port: process.env.STMP_PORT,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        }
      });

    await transport.sendMail({
        to,
        subject,
        text,
        from:"chouhanniki60@gmail.com",
    });
};