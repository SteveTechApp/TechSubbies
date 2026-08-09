import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { createUser, findUserByEmail } from "../lib/db.js";
import { signToken } from "../middleware/auth.js";
import { toPrivateUser } from "../lib/publicUser.js";
import { createRateLimit } from "../middleware/rateLimit.js";
import { createHash, randomBytes } from "node:crypto";
import { consumeAccountToken, createAccountToken, findUserById, markEmailVerified, revokeUserSessions, updatePasswordAndRevokeSessions } from "../lib/db.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import { sendAccountEmail } from "../lib/accountEmail.js";
import { canonicaliseEngineerProfile } from "../domain/marketplaceSchema.js";

export const authRouter = Router();
const emailKey=(req:any)=>`${req.ip}:${String(req.body?.email||'').trim().toLowerCase()}`;
const loginLimit=createRateLimit({windowMs:15*60_000,max:Number(process.env.LOGIN_ATTEMPT_LIMIT)||5,key:emailKey});
const registerLimit=createRateLimit({windowMs:60*60_000,max:Number(process.env.REGISTRATION_LIMIT)||25});
const recoveryLimit=createRateLimit({windowMs:60*60_000,max:Number(process.env.RECOVERY_LIMIT)||5,key:emailKey});
const hashToken=(value:string)=>createHash("sha256").update(value).digest("hex");
function issueAccountToken(userId:string,purpose:"verify-email"|"reset-password",minutes:number){const token=randomBytes(32).toString("base64url");createAccountToken(userId,purpose,hashToken(token),new Date(Date.now()+minutes*60_000).toISOString());return token;}
function deliveryResponse(token:string):Record<string,string>{return process.env.NODE_ENV==="test"?{debugToken:token}:{};}

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters."),
  role: z.enum(["Engineer", "Company", "Resourcing Company"]),
  name: z.string().min(1),
  // Full role-specific profile object the frontend already builds
  // (EngineerProfile / CompanyProfile / ResourcingCompanyProfile shape).
  profileData: z.record(z.any()).optional().default({}),
});

authRouter.post("/register", registerLimit, async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues.map((i) => i.message).join(", ") });
  }
  const { password, role, name, profileData } = parsed.data;
  const email=parsed.data.email.trim().toLowerCase();

  if (findUserByEmail(email)) {
    return res.status(409).json({ error: "An account with this email already exists." });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  let storedProfile:Record<string,unknown>={ ...profileData, name, contact: { email, ...(profileData.contact || {}) } };
  try{if(role==="Engineer")storedProfile=canonicaliseEngineerProfile(storedProfile);}catch(error){return res.status(400).json({error:error instanceof Error?error.message:"Invalid engineer capability profile."});}
  const user = createUser({
    email,
    password: passwordHash,
    role,
    name,
    profile: JSON.stringify(storedProfile),
  });

  const verificationToken=issueAccountToken(user.id,"verify-email",24*60);
  await sendAccountEmail({email:user.email,name:user.name,purpose:"verify-email",token:verificationToken});
  const token = signToken(user.id,user.sessionVersion);
  return res.status(201).json({ token, user: toPrivateUser(user),verificationRequired:true,...deliveryResponse(verificationToken) });
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

authRouter.post("/login", loginLimit, async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Email and password are required." });
  }
  const password=parsed.data.password;
  const email=parsed.data.email.trim().toLowerCase();

  const user = findUserByEmail(email);
  const dummyHash = "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy";
  const valid = await bcrypt.compare(password, user?.password || dummyHash);
  if (!user || !valid) {
    return res.status(401).json({ error: "Invalid credentials." });
  }

  const token = signToken(user.id,user.sessionVersion);
  return res.json({ token, user: toPrivateUser(user) });
});

authRouter.post("/verification/request",recoveryLimit,async(req,res,next)=>{try{const parsed=z.object({email:z.string().email()}).safeParse(req.body);if(parsed.success){const user=findUserByEmail(parsed.data.email.toLowerCase());if(user&&!user.emailVerifiedAt){const token=issueAccountToken(user.id,"verify-email",24*60);await sendAccountEmail({email:user.email,name:user.name,purpose:"verify-email",token});}}return res.status(202).json({message:"If the account can be verified, instructions have been sent."});}catch(error){next(error);}});
authRouter.post("/verification/confirm",(req,res)=>{const parsed=z.object({token:z.string().min(20)}).safeParse(req.body);if(!parsed.success)return res.status(400).json({error:"Invalid or expired verification token."});const record=consumeAccountToken(hashToken(parsed.data.token),"verify-email");if(!record)return res.status(400).json({error:"Invalid or expired verification token."});const user=markEmailVerified(record.userId)!;return res.json({verified:true,user:toPrivateUser(user)});});
authRouter.post("/password/forgot",recoveryLimit,async(req,res,next)=>{try{let debug:Record<string,string>={};const parsed=z.object({email:z.string().email()}).safeParse(req.body);if(parsed.success){const user=findUserByEmail(parsed.data.email.toLowerCase());if(user){const token=issueAccountToken(user.id,"reset-password",30);debug=deliveryResponse(token);await sendAccountEmail({email:user.email,name:user.name,purpose:"reset-password",token});}}return res.status(202).json({message:"If an account exists, password reset instructions have been sent.",...debug});}catch(error){next(error);}});
authRouter.post("/password/reset",async(req,res)=>{const parsed=z.object({token:z.string().min(20),password:z.string().min(12)}).safeParse(req.body);if(!parsed.success)return res.status(400).json({error:"A valid token and password of at least 12 characters are required."});const record=consumeAccountToken(hashToken(parsed.data.token),"reset-password");if(!record)return res.status(400).json({error:"Invalid or expired reset token."});await updatePasswordAndRevokeSessions(record.userId,await bcrypt.hash(parsed.data.password,12));return res.json({reset:true});});
authRouter.post("/sessions/revoke",requireAuth,(req:AuthedRequest,res)=>{revokeUserSessions(req.userId!);return res.json({revoked:true});});
