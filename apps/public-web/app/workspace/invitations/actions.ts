"use server";
import { createHash, randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
export async function createInvitation(formData: FormData) {
 const s:any=await createClient(); const email=String(formData.get("email")||"").trim().toLowerCase();
 const role=String(formData.get("role")||"prospect_member");
 if(!email || !["prospect_member","client_viewer","client_member"].includes(role)) redirect("/workspace/invitations?error=invalid");
 const {data:m}=await s.from("memberships").select("organization_id,role").eq("status","active"); const admin=m?.find((x:any)=>x.role==="qira_admin"); if(!admin) redirect("/workspace");
 const token=randomBytes(24).toString("base64url"); const token_hash=createHash("sha256").update(token).digest("hex");
 const {error}=await s.from("invitations").insert({organization_id:admin.organization_id,email,role,token_hash,invited_by:(await s.auth.getUser()).data.user.id,expires_at:new Date(Date.now()+7*864e5).toISOString()});
 if(error) redirect("/workspace/invitations?error=create"); redirect(`/workspace/invitations?token=${token}&role=${role}`);
}

export async function revokeMembership(formData: FormData) {
 const s:any=await createClient(); const organizationId=String(formData.get("organization_id")||""); const userId=String(formData.get("user_id")||""); const reason=String(formData.get("reason")||"").trim();
 if(!organizationId||!userId||reason.length<5)redirect("/workspace/invitations?error=revoke-input");
 const {error}=await s.rpc("revoke_membership",{target_organization_id:organizationId,target_user_id:userId,revocation_reason:reason});
 if(error)redirect("/workspace/invitations?error=revoke");
 revalidatePath("/workspace"); revalidatePath("/workspace/invitations"); redirect("/workspace/invitations?revoked=1");
}
