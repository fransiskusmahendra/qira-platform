"use server";

import { createHash, randomBytes } from "node:crypto";
import { businessBlueprintSnapshot, findBusinessBlueprint, getBusinessBlueprint } from "@qira/domain";
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
    return {status:"error",message:"Lengkapi nama, WhatsApp, dan persetujuan sebelum melanjutkan."};
  }

  const supabase=createAdminClient() as any;
  const {data:discovery,error}=await supabase.from("discoveries").select("id,organization_id,responses,status").eq("public_reference",reference).maybeSingle();
  if(error||!discovery)return {status:"error",message:"Cerita ini belum ditemukan. Muat ulang halaman atau hubungi QIRA."};

  // A browser refresh must not create repeated approvals or rotate the private
  // next-step token. Keep an already-recorded approval final; repeated revision
  // requests are also treated as the same request. A revised customer may still
  // approve later after QIRA has adjusted the direction.
  const {data:latestDecision,error:latestDecisionError}=await supabase
    .from("proposal_decisions")
    .select("decision,created_at")
    .eq("discovery_id",discovery.id)
    .order("created_at",{ascending:false})
    .limit(1)
    .maybeSingle();
  if(latestDecisionError){
    console.error("proposal_decision_lookup_failed",{code:latestDecisionError.code});
    return {status:"error",message:"Pilihan Anda belum dapat diperiksa. Silakan coba lagi."};
  }
  if(latestDecision?.decision==="approved"){
    return input.decision==="approved"
      ? {status:"success",message:"Persetujuan Anda sudah tercatat. QIRA akan melanjutkan dari pilihan tersebut."}
      : {status:"error",message:"Persetujuan sebelumnya sudah tercatat. Hubungi QIRA jika Anda ingin mengubah keputusan."};
  }
  if(latestDecision?.decision==="revision_requested"&&input.decision==="revision_requested"){
    return {status:"success",message:"Permintaan perubahan Anda sudah tercatat. QIRA akan menindaklanjutinya."};
  }

  const responses=discovery.responses??{};
  const storedBlueprintId=responses?._businessBlueprint?.id;
  const context=[responses.business_profile,responses.current_process,responses.pain_point].filter(Boolean).join(" ");
  const blueprint=getBusinessBlueprint(input.businessTypeId)||getBusinessBlueprint(storedBlueprintId)||findBusinessBlueprint(context);
  const businessName=clean(responses?._contact?.businessName,160)||blueprint?.name||"Usaha";
  const snapshot=blueprint?businessBlueprintSnapshot(blueprint):{
    id:input.businessTypeId||"general-business",
    name:businessName,
    packageId:"growth-engine",
    modules:["Pencatatan lebih rapi","Status pekerjaan mudah dilihat","Pengingat hal penting","Ringkasan untuk pemilik"],
    entities:["Pelanggan","Pekerjaan","Catatan"],
    roles:["Pemilik","Tim"],
    rules:["Setiap pekerjaan memiliki status","Perubahan penting dicatat","Pekerjaan selesai setelah dicek"],
    outputs:["Ringkasan pekerjaan","Laporan sederhana"],
    integrations:[],
    importTemplates:[],
  };

  const {data:decisionRow,error:decisionError}=await supabase.from("proposal_decisions").insert({
    organization_id:discovery.organization_id,
    discovery_id:discovery.id,
    public_reference:reference,
    decision:input.decision,
    signer_name:signerName,
    signer_email:signerEmail||null,
    signer_whatsapp:signerWhatsapp,
    consent_version:"proposal-decision-v1",
    proposal_snapshot:{reference,packageId:snapshot.packageId,businessTypeId:snapshot.id,decision:input.decision},
    blueprint_snapshot:snapshot,
  }).select("id").single();
  if(decisionError||!decisionRow)return {status:"error",message:"Pilihan Anda belum berhasil disimpan. Silakan coba lagi."};

  if(input.decision==="revision_requested"){
    await supabase.from("implementation_workspaces").update({status:"revision_required",updated_at:new Date().toISOString()}).eq("discovery_id",discovery.id);
    return {status:"success",message:"Permintaan perubahan sudah kami catat. QIRA akan menghubungi Anda."};
  }

  const rawToken=randomBytes(24).toString("base64url");
  const tokenHash=createHash("sha256").update(rawToken).digest("hex");
  const {error:workspaceError}=await supabase.from("implementation_workspaces").upsert({
    organization_id:discovery.organization_id,
    discovery_id:discovery.id,
    decision_id:decisionRow.id,
    public_reference:reference,
    business_type_id:snapshot.id,
    business_name:businessName,
    blueprint_snapshot:snapshot,
    configuration:{answers:responses,modules:snapshot.modules,roles:snapshot.roles,statuses:blueprint?.flow??["Baru","Dikerjakan","Dicek","Selesai"]},
    status:"awaiting_data",
    access_token_hash:tokenHash,
    updated_at:new Date().toISOString(),
  },{onConflict:"discovery_id"});
  if(workspaceError)return {status:"error",message:"Pilihan Anda sudah tersimpan. QIRA akan menindaklanjuti langkah berikutnya secara langsung."};

  return {status:"success",message:"Siap. Pilihan Anda sudah tersimpan dan QIRA bisa melanjutkan ke tahap berikutnya.",implementationUrl:`/implementation/${rawToken}`};
}
