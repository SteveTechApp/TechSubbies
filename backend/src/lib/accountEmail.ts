import nodemailer from "nodemailer";

type Purpose="verify-email"|"reset-password";
export async function sendAccountEmail(input:{email:string;name:string;purpose:Purpose;token:string}){
  const base=(process.env.ACCOUNT_ACTION_URL||process.env.FRONTEND_ORIGIN||"http://localhost:5173").split(",")[0].replace(/\/$/,"");
  const path=input.purpose==="verify-email"?"verify-email":"reset-password";
  const link=`${base}/${path}?token=${encodeURIComponent(input.token)}`;
  if(process.env.NODE_ENV==="test")return;
  const host=process.env.SMTP_HOST,from=process.env.EMAIL_FROM;
  if(!host||!from){if(process.env.NODE_ENV==="production")throw new Error("Account email delivery is not configured.");console.info(`[account-email] ${input.purpose} link for ${input.email}: ${link}`);return;}
  const transport=nodemailer.createTransport({host,port:Number(process.env.SMTP_PORT||587),secure:process.env.SMTP_SECURE==="true",auth:process.env.SMTP_USER?{user:process.env.SMTP_USER,pass:process.env.SMTP_PASSWORD}:undefined});
  const verification=input.purpose==="verify-email";
  await transport.sendMail({from,to:input.email,subject:verification?"Verify your TechSubbies email":"Reset your TechSubbies password",text:`Hello ${input.name},\n\n${verification?"Verify your email":"Reset your password"} using this link:\n${link}\n\nIf you did not request this, you can ignore this email.`});
}
