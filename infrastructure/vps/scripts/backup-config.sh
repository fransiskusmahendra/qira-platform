#!/usr/bin/env bash
set -Eeuo pipefail

# Backs up non-secret host/app configuration. Database backup is intentionally separate.
# Usage: backup-config.sh /opt/qira/backups

DEST="${1:-/opt/qira/backups}"
mkdir -p "${DEST}"
chmod 700 "${DEST}"

timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
archive="${DEST}/qira-vps-config-${timestamp}.tar.gz"

# Deliberately exclude customer .env files and SSH private material.
tar \
  --exclude='*/.env' \
  --exclude='*/.ssh/*' \
  --exclude='*.key' \
  --exclude='*.pem' \
  -czf "${archive}" \
  /etc/caddy/Caddyfile \
  /etc/ssh/sshd_config.d/99-qira-hardening.conf \
  /etc/fail2ban/jail.d/qira-sshd.local \
  /opt/qira/apps/*/compose.yaml 2>/dev/null || {
    rm -f "${archive}"
    echo "Configuration backup failed." >&2
    exit 1
  }

chmod 600 "${archive}"
echo "Created ${archive}"
echo "Copy this archive to approved encrypted off-host storage. It is not a database backup."
