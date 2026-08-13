# QIRA Managed VPS — Operations Runbook

This directory is the reusable baseline for customer workloads that cannot or should not run on QIRA's default managed platform.

It is intentionally provider-neutral. A compatible VPS needs Ubuntu LTS, a public IPv4/IPv6 address, SSH access, and enough resources for the approved workload.

## Operating model

```text
Customer domain
      |
      v
DNS -> VPS :80/:443
      |
      v
    Caddy
      |
      v
Docker application container
      |
      +--> Supabase / approved managed data services
```

GitHub Actions performs controlled deployments over SSH. The VPS does not need a GitHub account or a long-lived GitHub personal access token.

## What is prepared before a VPS exists

- `bootstrap-ubuntu.sh`: one-time host bootstrap.
- `Caddyfile.example`: domain-to-container reverse proxy template.
- `customer/compose.yaml`: reusable container baseline.
- `customer/.env.example`: non-secret deployment configuration example.
- `scripts/deploy.sh`: release/update and health-check script.
- `scripts/rollback.sh`: rollback to the previous image.
- `.github/workflows/vps-deploy-template.yml`: manual reusable deployment workflow template.
- `docs/adr/ADR-0003-managed-vps-deployment.md`: architecture decision.

## First customer activation

Do these in order. Do not point customer DNS at the server until the preflight checks pass.

1. Provision an Ubuntu LTS VPS sized for the workload. Do not select a provider solely on promotional price; verify region, backup options, recovery console, network limits, renewal price, and support.
2. Add an operator SSH public key at provisioning time. Keep provider console/recovery access available.
3. Copy `bootstrap-ubuntu.sh` to the server and run it as root with `QIRA_ADMIN_PUBKEY` set to the approved public key.
4. Open a second terminal and verify `ssh qira-deploy@SERVER_IP` works before disabling or abandoning the original provider access path.
5. Confirm Docker, Caddy, UFW and fail2ban are healthy.
6. Create `/opt/qira/apps/<customer-slug>` owned by `qira-deploy` and copy the customer `compose.yaml` plus server-side `.env` there.
7. Create a GitHub Actions deployment SSH key dedicated to this server/environment. Put its public key in `/home/qira-deploy/.ssh/authorized_keys`; store the private key only as a GitHub Actions secret.
8. Configure repository/environment secrets: `VPS_HOST`, `VPS_PORT`, `VPS_USER`, `VPS_SSH_KEY`, `VPS_KNOWN_HOSTS`, and `VPS_APP_DIR`. Prefer a protected GitHub Environment named `production` with required approval when available.
9. Build/publish the application image. Use immutable tags (commit SHA), not `latest`, for production release history.
10. Deploy once using the server IP/private route and verify the application health endpoint.
11. Add the customer hostname to `/etc/caddy/Caddyfile`, validate with `caddy validate --config /etc/caddy/Caddyfile`, then reload Caddy.
12. Change the customer's DNS A/AAAA records only after the application is healthy. DNS remains customer-owned.
13. Verify HTTPS, redirects, application login/critical flows, and external integrations.
14. Record the deployment, domain, infrastructure owner, backup policy, renewal date, and support scope in QIRA's managed-service records.

## Required GitHub secrets

| Secret | Purpose |
|---|---|
| `VPS_HOST` | Server hostname/IP used by Actions |
| `VPS_PORT` | SSH port, normally `22` |
| `VPS_USER` | Normally `qira-deploy` |
| `VPS_SSH_KEY` | Dedicated private deployment key |
| `VPS_KNOWN_HOSTS` | Pinned SSH host key entry; never use `StrictHostKeyChecking=no` |
| `VPS_APP_DIR` | Example `/opt/qira/apps/customer-a` |

Application secrets such as database passwords, service-role keys, API secrets and signing keys stay on the server/approved secret manager. Do not pass them as ordinary workflow variables and do not commit them.

## DNS pattern

For a single VPS public IP:

```text
A     @       <VPS_IPV4>
A     www     <VPS_IPV4>
```

If IPv6 is intentionally configured, add AAAA records only after IPv6 ingress is tested. Do not publish an AAAA record that points to an unconfigured interface.

Caddy can obtain public TLS certificates after the hostname resolves to the server and ports 80/443 are reachable.

## Shared VPS guardrails

A shared QIRA VPS is not a universal default. Before placing another customer on the same host, verify:

- no contractual or regulatory requirement for dedicated infrastructure;
- workload is low/medium risk and resource usage is predictable;
- containers do not expose application ports publicly;
- separate app directories, environment files and container names are used;
- CPU/memory limits are set and capacity headroom remains;
- database/tenant isolation remains enforced independently of Docker isolation;
- backups and restore procedures identify each customer's data;
- one customer's deployment cannot restart another customer's stack.

Move a customer to dedicated infrastructure when isolation, compliance, traffic, performance, custom networking, or operational risk justifies it.

## Backup baseline

At minimum protect three independent layers:

1. Source and release history — GitHub plus immutable image tags.
2. Persistent customer data — provider-native managed database backup/PITR where available, or an encrypted database backup if QIRA hosts the database.
3. Server configuration — encrypted backup of approved configuration required to rebuild the host. Never commit production `.env` or private keys.

Provider snapshots are useful for disaster recovery but do not replace application-aware database backups.

### Recovery test

Before promising managed backup/recovery to a customer:

- restore into a non-production target;
- start the restored application;
- verify critical data and authentication;
- document actual recovery time and any manual steps;
- delete the temporary restored environment securely.

Repeat recovery tests after material architecture changes and on the service schedule promised to the customer.

## Monitoring baseline

Until QIRA's full observability platform is implemented, every VPS must have:

- application `/api/health` check;
- container restart policy;
- disk, memory and CPU visibility from the VPS provider or an approved monitor;
- alerting for application unavailability;
- Caddy and application logs with rotation;
- expiry/renewal tracking for the VPS and customer domain;
- documented escalation contact and incident notes.

Do not advertise a numerical SLA until monitoring, redundancy and incident response actually support it.

## Patch cadence

- Enable unattended security updates during bootstrap.
- Review available OS/package updates at least monthly and before high-risk launches.
- Review Docker/application dependency vulnerabilities as part of CI and maintenance.
- Reboot after kernel/security updates when required, using a communicated maintenance window for production customers.

## Incident quick path

1. Confirm whether DNS, Caddy, container, database, or upstream service is failing.
2. Capture timestamp, affected customer, release SHA and relevant sanitized logs.
3. If the current release caused the incident, run `rollback.sh` to the recorded previous image.
4. If the host is unhealthy, use provider recovery access and restore/rebuild from the documented baseline.
5. Communicate only verified impact and recovery status to the customer.
6. After recovery, document root cause and improve the reusable QIRA baseline.

## Offboarding

When a managed-service agreement ends:

- confirm domain ownership remains with the customer;
- export/transfer customer data and source artifacts according to the contract;
- revoke QIRA deployment keys and customer-specific credentials;
- remove DNS records only with customer authorization;
- delete QIRA-held customer data according to the retention agreement;
- retain only records QIRA is legally/contractually required to retain;
- record completion of offboarding.

## Production readiness gate

A customer VPS is `LIVE` only when all are true:

- [ ] Non-root SSH deployment works with keys.
- [ ] Password SSH and root SSH are disabled after verification.
- [ ] UFW exposes only approved ports.
- [ ] Docker and Caddy start after reboot.
- [ ] Application port is not public.
- [ ] Production secrets are absent from Git history.
- [ ] Health check passes.
- [ ] Caddy configuration validates.
- [ ] HTTPS works on customer domain.
- [ ] Critical customer flows pass.
- [ ] Backup exists and restore has been tested for the promised scope.
- [ ] Monitoring/alerting is active.
- [ ] Rollback to previous release is documented/tested.
- [ ] Customer/domain/server ownership and renewal dates are recorded.
- [ ] Managed-service scope and incident contact are recorded.
