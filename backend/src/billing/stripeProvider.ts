import Stripe from "stripe";

export type MembershipPlan = "professional" | "skills" | "business";

function stripeClient(){const key=process.env.STRIPE_SECRET_KEY;if(!key)throw new Error("Membership checkout is not configured.");return new Stripe(key);}
function priceId(plan:MembershipPlan){const keys:Record<MembershipPlan,string|undefined>={professional:process.env.STRIPE_PRICE_PROFESSIONAL,skills:process.env.STRIPE_PRICE_SKILLS,business:process.env.STRIPE_PRICE_BUSINESS};const value=keys[plan];if(!value)throw new Error(`Stripe price is not configured for the ${plan} plan.`);return value;}
export function assertStripeMembershipConfigured(plan:MembershipPlan){stripeClient();priceId(plan);if(!process.env.STRIPE_WEBHOOK_SECRET)throw new Error("Membership webhook is not configured.");}

export async function createStripeMembershipCheckout(input:{userId:string;email:string;plan:MembershipPlan;invoiceId:string}){
  assertStripeMembershipConfigured(input.plan);
  const frontend=(process.env.FRONTEND_ORIGIN||"http://localhost:5173").split(",")[0].trim();
  const session=await stripeClient().checkout.sessions.create({mode:"subscription",customer_email:input.email,client_reference_id:input.userId,line_items:[{price:priceId(input.plan),quantity:1}],success_url:`${frontend}/?membership=success&session_id={CHECKOUT_SESSION_ID}`,cancel_url:`${frontend}/?membership=cancelled`,metadata:{userId:input.userId,plan:input.plan,invoiceId:input.invoiceId},subscription_data:{metadata:{userId:input.userId,plan:input.plan,invoiceId:input.invoiceId}}});
  if(!session.url)throw new Error("Payment provider did not return a checkout URL.");
  return {id:session.id,url:session.url};
}

export function constructStripeEvent(body:Buffer,signature:string){const secret=process.env.STRIPE_WEBHOOK_SECRET;if(!secret)throw new Error("Membership webhook is not configured.");return stripeClient().webhooks.constructEvent(body,signature,secret);}
