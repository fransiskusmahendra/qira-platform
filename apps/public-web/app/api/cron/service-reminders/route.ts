import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Reminder = {
  organization_id: string;
  customer_id: string;
  project_id: string | null;
  reminder_type: string;
  reminder_key: string;
  title: string;
  body: string;
  due_on: string | null;
  severity: "normal" | "warning" | "urgent";
  status: "open";
};

type Notification = {
  organization_id: string;
  proposal_id: string | null;
  kind: "lead_follow_up" | "proposal_follow_up" | "proposal_expiring";
  title: string;
  body: string;
  email_status: "unconfigured";
  dedupe_key: string;
};

export async function GET(request: NextRequest) {
  const expected = process.env.CRON_SECRET;
  if (!expected || request.headers.get("authorization") !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !secret) return NextResponse.json({ error: "server_not_configured" }, { status: 503 });

  const supabase = createClient(url, secret, { auth: { persistSession: false, autoRefreshToken: false } });
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const horizon = new Date(now);
  horizon.setUTCDate(horizon.getUTCDate() + 45);
  const limit = horizon.toISOString().slice(0, 10);
  const sevenDays = new Date(now);
  sevenDays.setUTCDate(sevenDays.getUTCDate() + 7);
  const sevenDayLimit = sevenDays.toISOString().slice(0, 10);
  const followUpCutoff = new Date(now.getTime() - 3 * 86400000).toISOString();

  const [
    { data: customers, error: customerError },
    { data: projects, error: projectError },
    { data: domains, error: domainError },
    { data: subscriptions, error: subscriptionError },
    { data: tickets, error: ticketError },
    { data: leads, error: leadError },
    { data: proposals, error: proposalError },
    { data: qiraMemberships, error: membershipError },
  ] = await Promise.all([
    supabase.from("customers").select("id,organization_id,display_name"),
    supabase.from("managed_projects").select("id,customer_id,name,next_review_on,service_status").lte("next_review_on", limit).in("service_status", ["active", "attention", "maintenance"]),
    supabase.from("project_domains").select("id,project_id,hostname,expires_on,status").lte("expires_on", limit).in("status", ["active", "expiring", "issue"]),
    supabase.from("project_subscriptions").select("id,project_id,name,next_billing_on,status,amount_idr").lte("next_billing_on", limit).in("status", ["trial", "active", "past_due"]),
    supabase.from("support_tickets").select("id,customer_id,project_id,ticket_number,subject,due_at,status").lte("due_at", `${limit}T23:59:59Z`).in("status", ["open", "in_progress", "waiting_customer"]),
    supabase.from("public_leads").select("id,full_name,business_name,lead_temperature,status,next_follow_up_at").lte("next_follow_up_at", now.toISOString()).in("status", ["new", "contacted", "discovery", "demo", "proposal", "negotiation"]),
    supabase.from("proposals").select("id,organization_id,proposal_number,client_name,version,status,valid_until,updated_at").eq("status", "shared"),
    supabase.from("memberships").select("organization_id").eq("status", "active").in("role", ["qira_admin", "qira_consultant"]),
  ]);

  if (customerError || projectError || domainError || subscriptionError || ticketError || leadError || proposalError || membershipError) {
    console.error("operations_cron_query_failed", {
      customer: customerError?.code,
      project: projectError?.code,
      domain: domainError?.code,
      subscription: subscriptionError?.code,
      ticket: ticketError?.code,
      lead: leadError?.code,
      proposal: proposalError?.code,
      membership: membershipError?.code,
    });
    return NextResponse.json({ error: "query_failed" }, { status: 500 });
  }

  const customerById = new Map((customers ?? []).map((item: any) => [item.id, item]));
  const projectById = new Map<string, any>();
  for (const project of projects ?? []) projectById.set(project.id, project);

  if ((domains ?? []).length || (subscriptions ?? []).length) {
    const ids = [...new Set([...(domains ?? []).map((item: any) => item.project_id), ...(subscriptions ?? []).map((item: any) => item.project_id)])];
    if (ids.length) {
      const { data } = await supabase.from("managed_projects").select("id,customer_id,name").in("id", ids);
      for (const project of data ?? []) projectById.set(project.id, project);
    }
  }

  const severity = (due: string | null): "normal" | "warning" | "urgent" => {
    if (!due) return "normal";
    if (due < today) return "urgent";
    const warningLimit = new Date(now);
    warningLimit.setUTCDate(warningLimit.getUTCDate() + 14);
    return due <= warningLimit.toISOString().slice(0, 10) ? "warning" : "normal";
  };

  const reminders: Reminder[] = [];
  for (const project of projects ?? []) {
    const customer = customerById.get(project.customer_id);
    if (customer) reminders.push({ organization_id: customer.organization_id, customer_id: customer.id, project_id: project.id, reminder_type: "project_review", reminder_key: `project_review:${project.id}:${project.next_review_on}`, title: `Review project: ${project.name}`, body: `Review layanan ${customer.display_name} dijadwalkan ${project.next_review_on}.`, due_on: project.next_review_on, severity: severity(project.next_review_on), status: "open" });
  }
  for (const domain of domains ?? []) {
    const project = projectById.get(domain.project_id);
    const customer = project && customerById.get(project.customer_id);
    if (customer) reminders.push({ organization_id: customer.organization_id, customer_id: customer.id, project_id: project.id, reminder_type: "domain_expiry", reminder_key: `domain_expiry:${domain.id}:${domain.expires_on}`, title: `Domain akan kedaluwarsa: ${domain.hostname}`, body: `${domain.hostname} milik ${customer.display_name} kedaluwarsa ${domain.expires_on}.`, due_on: domain.expires_on, severity: severity(domain.expires_on), status: "open" });
  }
  for (const subscription of subscriptions ?? []) {
    const project = projectById.get(subscription.project_id);
    const customer = project && customerById.get(project.customer_id);
    if (customer) reminders.push({ organization_id: customer.organization_id, customer_id: customer.id, project_id: project.id, reminder_type: "subscription_due", reminder_key: `subscription_due:${subscription.id}:${subscription.next_billing_on}`, title: `Tagihan layanan: ${subscription.name}`, body: `Tagihan ${customer.display_name} sebesar Rp${Number(subscription.amount_idr).toLocaleString("id-ID")} jatuh tempo ${subscription.next_billing_on}.`, due_on: subscription.next_billing_on, severity: severity(subscription.next_billing_on), status: "open" });
  }
  for (const ticket of tickets ?? []) {
    const customer = customerById.get(ticket.customer_id);
    if (customer) {
      const due = ticket.due_at?.slice(0, 10) ?? null;
      reminders.push({ organization_id: customer.organization_id, customer_id: customer.id, project_id: ticket.project_id, reminder_type: "ticket_due", reminder_key: `ticket_due:${ticket.id}:${due}`, title: `Tiket perlu ditangani: ${ticket.ticket_number}`, body: `${ticket.subject} untuk ${customer.display_name} memiliki target ${due ?? "belum ditentukan"}.`, due_on: due, severity: severity(due), status: "open" });
    }
  }

  if (reminders.length) {
    const { error } = await supabase.from("service_reminders").upsert(reminders, { onConflict: "reminder_key", ignoreDuplicates: true });
    if (error) {
      console.error("operations_cron_service_write_failed", { code: error.code });
      return NextResponse.json({ error: "write_failed" }, { status: 500 });
    }
  }

  const organizationIds = [...new Set((qiraMemberships ?? []).map((item: any) => String(item.organization_id)))];
  const notifications: Notification[] = [];
  for (const lead of leads ?? []) {
    const dueKey = String(lead.next_follow_up_at).slice(0, 10);
    for (const organizationId of organizationIds) {
      notifications.push({
        organization_id: organizationId,
        proposal_id: null,
        kind: "lead_follow_up",
        title: `Follow-up lead: ${lead.business_name}`,
        body: `${lead.full_name} · ${lead.lead_temperature === "hot" ? "Hot lead" : "Belum ditindaklanjuti"}`,
        email_status: "unconfigured",
        dedupe_key: `lead-followup:${organizationId}:${lead.id}:${dueKey}`,
      });
    }
  }

  const proposalIds = (proposals ?? []).map((item: any) => item.id);
  let decisions: any[] = [];
  if (proposalIds.length) {
    const { data, error } = await supabase.from("proposal_client_decisions").select("proposal_id,proposal_version").in("proposal_id", proposalIds);
    if (error) {
      console.error("operations_cron_decision_query_failed", { code: error.code });
      return NextResponse.json({ error: "query_failed" }, { status: 500 });
    }
    decisions = data ?? [];
  }
  const decisionKeys = new Set(decisions.map((item: any) => `${item.proposal_id}:${item.proposal_version}`));

  for (const proposal of proposals ?? []) {
    if (decisionKeys.has(`${proposal.id}:${proposal.version}`)) continue;
    const validUntil = String(proposal.valid_until);
    if (validUntil <= sevenDayLimit) {
      notifications.push({
        organization_id: proposal.organization_id,
        proposal_id: proposal.id,
        kind: "proposal_expiring",
        title: `Follow-up proposal: ${proposal.client_name}`,
        body: validUntil < today ? `${proposal.proposal_number} sudah melewati masa berlaku ${validUntil}.` : `${proposal.proposal_number} berlaku sampai ${validUntil}.`,
        email_status: "unconfigured",
        dedupe_key: `proposal-expiring:${proposal.id}:v${proposal.version}:${validUntil}`,
      });
    } else if (proposal.updated_at <= followUpCutoff) {
      notifications.push({
        organization_id: proposal.organization_id,
        proposal_id: proposal.id,
        kind: "proposal_follow_up",
        title: `Cek keputusan: ${proposal.client_name}`,
        body: `${proposal.proposal_number} belum mendapat respons setelah dibagikan.`,
        email_status: "unconfigured",
        dedupe_key: `proposal-followup:${proposal.id}:v${proposal.version}`,
      });
    }
  }

  if (notifications.length) {
    const { error } = await supabase.from("notifications").upsert(notifications, { onConflict: "dedupe_key", ignoreDuplicates: true });
    if (error) {
      console.error("operations_cron_notification_write_failed", { code: error.code });
      return NextResponse.json({ error: "notification_write_failed" }, { status: 500 });
    }
  }

  return NextResponse.json({
    ok: true,
    serviceReminders: reminders.length,
    salesNotifications: notifications.length,
    horizon: limit,
  });
}
