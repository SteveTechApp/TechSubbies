import express, { Router } from "express";
import type Stripe from "stripe";
import { z } from "zod";
import { assertStripeMembershipConfigured, createStripeMembershipCheckout, constructStripeEvent } from "../billing/stripeProvider.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import { activateMembership, cancelMembership, createMembershipCheckoutSession, createMembershipInvoice, findUserById, getMembershipSubscription, listMembershipInvoices } from "../lib/db.js";

const plans={professional:700,skills:1500,business:3500} as const;
const schema=z.object({plan:z.enum(["professional","skills","business"])});
export const membershipBillingRouter=Router();

membershipBillingRouter.get("/membership",requireAuth,(req:AuthedRequest,res)=>res.json({subscription:getMembershipSubscription(req.userId!),invoices:listMembershipInvoices(req.userId!)}));
membershipBillingRouter.post("/membership/checkout",requireAuth,async(req:AuthedRequest,res,next)=>{try{const user=findUserById(req.userId!);if(user?.role!=="Engineer")return res.status(403).json({error:"Paid memberships are available to engineer accounts only."});const parsed=schema.safeParse(req.body);if(!parsed.success)return res.status(400).json({error:"Choose a paid engineer membership plan."});assertStripeMembershipConfigured(parsed.data.plan);if((listMembershipInvoices(req.userId!) as any[]).some(item=>item.plan===parsed.data.plan&&item.status==="open"))return res.status(409).json({error:"An open invoice already exists for this membership plan."});const invoice:any=createMembershipInvoice(req.userId!,parsed.data.plan,plans[parsed.data.plan],"GBP");const checkout=await createStripeMembershipCheckout({userId:req.userId!,email:user.email,plan:parsed.data.plan,invoiceId:invoice.id});createMembershipCheckoutSession(checkout.id,invoice.id,req.userId!,parsed.data.plan);return res.status(201).json({invoice,checkoutUrl:checkout.url});}catch(error){next(error);}});

export const membershipWebhookBody=express.raw({type:"application/json",limit:"256kb"});
export function membershipWebhook(req:express.Request,res:express.Response){try{const signature=req.headers["stripe-signature"];if(typeof signature!=="string")return res.status(400).json({error:"Missing Stripe signature."});const event=constructStripeEvent(req.body as Buffer,signature) as Stripe.Event;if(event.type==="checkout.session.completed"){const session=event.data.object as Stripe.Checkout.Session;if(session.payment_status==="paid"||session.payment_status==="no_payment_required")activateMembership(event.id,event.type,session.id,typeof session.customer==="string"?session.customer:undefined,typeof session.subscription==="string"?session.subscription:undefined);}else if(event.type==="customer.subscription.deleted"){const subscription=event.data.object as Stripe.Subscription;cancelMembership(event.id,event.type,subscription.id);}return res.json({received:true});}catch(error){return res.status(400).json({error:error instanceof Error?error.message:"Invalid webhook."});}}
