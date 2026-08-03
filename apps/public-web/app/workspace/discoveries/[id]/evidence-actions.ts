"use server";
import { createHash, randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../../../../lib/supabase/server";
const ALLOWED=new Set(["application/pdf","image/png","image/jpeg","text/plain"]);
export async function uploadEvidence(formData:FormData){
 const s:any=await createClient(); const discoveryId=String(formData.get("discovery_id")||""); const file=formData.get("file");
 if(!(file instanceof File)||!discoveryId||file.size<1||file.size>20971520||!ALLOWED.has(file.type)) redirect(`/workspace/discoveries/${discoveryId}?error=file`);
 const {data:d}=await s.from("discoveries").select("organization_id").eq("id",discoveryId).single(); if(!d)redirect("/workspace");
 const bytes=Buffer.from(await file.arrayBuffer()); const checksum=createHash("sha256").update(bytes).digest("hex");
 const safe=file.name.replace(/[^a-zA-Z0-9._-]/g,"_"); const path=`${d.organization_id}/${discoveryId}/${randomUUID()}-${safe}`;
 const {error:u}=await s.storage.from("discovery-evidence").upload(path,bytes,{contentType:file.type,upsert:false}); if(u)redirect(`/workspace/discoveries/${discoveryId}?error=upload`);
 const user=(await s.auth.getUser()).data.user; const {error:m}=await s.from("evidence").insert({discovery_id:discoveryId,organization_id:d.organization_id,object_path:path,original_name:file.name,mime_type:file.type,size_bytes:file.size,checksum_sha256:checksum,uploaded_by:user.id});
 if(m){await s.storage.from("discovery-evidence").remove([path]);redirect(`/workspace/discoveries/${discoveryId}?error=metadata`)} revalidatePath(`/workspace/discoveries/${discoveryId}`);
}
export async function downloadEvidence(formData:FormData){const s:any=await createClient();const id=String(formData.get("evidence_id")||"");const {data:e}=await s.from("evidence").select("object_path").eq("id",id).single();if(!e)redirect("/workspace");const {data}=await s.storage.from("discovery-evidence").createSignedUrl(e.object_path,60);if(!data)redirect("/workspace");redirect(data.signedUrl)}
