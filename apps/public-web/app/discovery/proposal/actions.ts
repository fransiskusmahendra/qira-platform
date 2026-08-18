"use server";

import { createHash, randomBytes } from "node:crypto";
import { businessBlueprintSnapshot, getBusinessBlueprint } from "@qira/domain";
import { createAdminClient } from "../../../lib/supabase/admin";

type DecisionInput = {
  reference: string;
  businessTypeId?: string;
  decision: "approved" | "revision_requested";
  signerName: string;
  signerEmail?: string;
  signerWhatsapp: string;
  consented: boolean;
};

export type DecisionResult = { status:"success"|"error"; message:string; implementationUrl?:string };

const emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern=/^[0-9+() -]{8,24}$/;
const clean=(value:string|undefined,max:number)=>String(value??"").trim().slice(0,max);

export async function submitProposalDecision(input:DecisionInput):Promise<DecisionResult>{
  const reference=clean(input.reference,80);
  const signerName=clean(input.signerName,160);
  const signerEmail=clean(input.signerEmail,254).toLowerCase();
  const signerWhatsapp=clean(input.signerWhatsapp,24);
  if(!reference||signerName.length<2||!phonePattern.test(signerWhatsapp)||(signerEmail&&!emailPattern.test(signerEmail))||!input.consented||!["approved","revision_requested"].includes(input.decision)){
    return {status:"error",message:"Lengkapi nama, WhatsApp, persetujuan, dan email yang valid."};
  }

  const supabase=createAdminClient() as any;
  const {data:discovery,error}=await supabase.from("discoveries").select("id,organization_id,responses,status").eq("public_reference",reference).maybeSingle();
  if(error||!discovery)return {status:"error",message:"Referensi Discovery tidak ditemukan. Muat ulang proposal atau hubungi QIRA."};

  const storedBlueprintId=discovery.responses?._businessBlueprint?.id;
  const blueprint=getBusinessBlueprint(input.businessTypeId)||getBusinessBlueprint(storedBlueprintId);
  if(!blueprint)return {status:"error",message:"Blueprint usaha belum dapat ditentukan. Minta QIRA meninjau Discovery ini."};
  const snapshot=businessBlueprintSnapshot(blueprint);

  const {data:decisionRow,error:decisionError}=await supabase.from("proposal_decisions").insert({
    organization_id:discovery.organization_id,
    discovery_id:discovery.id,
    public_reference:reference,
    decision:input.decision,
    signer_name:signerName,
    signer_email:signerEmail||null,
    signer_whatsapp:signerWhatsapp,
    consent_version:"proposal-decision-v1",
    proposal_snapshot:{reference,packageId:blueprint.packageId,businessTypeId:blueprint.id,decision:input.decision},
    blueprint_snapshot:snapshot,
  }).select("id").single();
  if(decisionError||!decisionRow)return {status:"error",message:"Persetujuan belum berhasil dicatat. Silakan coba kembali."};

  if(input.decision==="revision_requested"){
    await supabase.from("implementation_workspaces").update({status:"revision_required",updated_at:new Date().toISOString()}).eq("discovery_id",discovery.id);
    return {status:"success",message:"Permintaan revisi tercatat. Tim QIRA akan meninjau scope dan menghubungi Anda."};
  }

  const rawToken=randomBytes(24).toString("base64url");
  const tokenHash=createHash("sha256").update(rawToken).digest("hex");
  const businessName=clean(discovery.responses?._contact?.businessName,160)||blueprint.name;
  const {error:workspaceError}=await supabase.from("implementation_workspaces").upsert({
    organization_id:discovery.organization_id,
    discovery_id:discovery.id,
    decision_id:decisionRow.id,
    public_reference:reference,
    business_type_id:blueprint.id,
    business_name:businessName,
    blueprint_snapshot:snapshot,
    configuration:{answers:discovery.responses,modules:snapshot.modules,roles:snapshot.roles,statuses:blueprint.flow},
    status:"awaiting_data",
    access_token_hash:tokenHash,
    updated_at:new Date().toISOString(),
  },{onConflict:"discovery_id"});
  if(workspaceError)return {status:"error",message:"Persetujuan tercatat, tetapi workspace belum berhasil dibuat. Tim QIRA akan menindaklanjutinya."};

  return {status:"success",message:"Persetujuan tercatat dan workspace implementasi sudah dibuat.",implementationUrl:`/implementation/${rawToken}`};
}
