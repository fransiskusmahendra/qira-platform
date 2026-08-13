#!/usr/bin/env bash
set -Eeuo pipefail

# QIRA Managed VPS bootstrap
# Target: a fresh Ubuntu LTS VPS. Run once as root from the provider console/SSH.
# Required: QIRA_ADMIN_PUBKEY='ssh-ed25519 AAAA... qira-operator' ./bootstrap-ubuntu.sh

if [[ "${EUID}" -ne 0 ]]; then
  echo "Run this script as root." >&2
  exit 1
fi

: "${QIRA_ADMIN_PUBKEY:?Set QIRA_ADMIN_PUBKEY to an approved SSH public key before running.}"

DEPLOY_USER="${QIRA_DEPLOY_USER:-qira-deploy}"
SSH_PORT="${QIRA_SSH_PORT:-22}"

if ! [[ "${SSH_PORT}" =~ ^[0-9]+$ ]] || (( SSH_PORT < 1 || SSH_PORT > 65535 )); then
  echo "QIRA_SSH_PORT must be between 1 and 65535." >&2
  exit 1
fi

export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get -y upgrade
apt-get install -y ca-certificates curl gnupg ufw fail2ban unattended-upgrades apt-transport-https

# Docker's official apt repository.
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc
. /etc/os-release
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu ${VERSION_CODENAME} stable" > /etc/apt/sources.list.d/docker.list
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Caddy's official apt repository.
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' > /etc/apt/sources.list.d/caddy-stable.list
apt-get update
apt-get install -y caddy

if ! id "${DEPLOY_USER}" >/dev/null 2>&1; then
  adduser --disabled-password --gecos "QIRA deployment account" "${DEPLOY_USER}"
fi
usermod -aG docker "${DEPLOY_USER}"

install -d -m 0700 -o "${DEPLOY_USER}" -g "${DEPLOY_USER}" "/home/${DEPLOY_USER}/.ssh"
printf '%s\n' "${QIRA_ADMIN_PUBKEY}" > "/home/${DEPLOY_USER}/.ssh/authorized_keys"
chown "${DEPLOY_USER}:${DEPLOY_USER}" "/home/${DEPLOY_USER}/.ssh/authorized_keys"
chmod 0600 "/home/${DEPLOY_USER}/.ssh/authorized_keys"

install -d -m 0750 -o "${DEPLOY_USER}" -g "${DEPLOY_USER}" /opt/qira /opt/qira/apps

cat > /etc/ssh/sshd_config.d/99-qira-hardening.conf <<EOF
Port ${SSH_PORT}
PermitRootLogin no
PasswordAuthentication no
KbdInteractiveAuthentication no
PubkeyAuthentication yes
X11Forwarding no
AllowUsers ${DEPLOY_USER}
EOF
sshd -t

ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow "${SSH_PORT}/tcp" comment 'QIRA SSH'
ufw allow 80/tcp comment 'HTTP for Caddy'
ufw allow 443/tcp comment 'HTTPS for Caddy'
ufw --force enable

cat > /etc/fail2ban/jail.d/qira-sshd.local <<EOF
[sshd]
enabled = true
port = ${SSH_PORT}
backend = systemd
maxretry = 5
findtime = 10m
bantime = 1h
EOF

cat > /etc/apt/apt.conf.d/20auto-upgrades <<'EOF'
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
EOF

systemctl enable --now docker
systemctl enable --now caddy
systemctl enable --now fail2ban
systemctl restart ssh

cat <<EOF

QIRA VPS bootstrap complete.

IMPORTANT — keep this root/provider session open.
1. From a SECOND terminal, verify:
   ssh -p ${SSH_PORT} ${DEPLOY_USER}@<SERVER_IP>
2. Verify: docker version && docker compose version
3. Verify: sudo is intentionally NOT granted to ${DEPLOY_USER}; use provider/root break-glass access for host administration.
4. Copy/activate the Caddy and customer deployment templates only after SSH verification.
5. Record the SSH host key for GitHub Actions with:
   ssh-keyscan -p ${SSH_PORT} <SERVER_IP>
   Verify the fingerprint through the provider console before storing it as VPS_KNOWN_HOSTS.

Do not close your original recovery session until step 1 succeeds.
EOF
