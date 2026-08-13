#!/usr/bin/env bash
set -Eeuo pipefail

# Run as root after copying this infrastructure/vps directory to the server.
SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_USER="${QIRA_DEPLOY_USER:-qira-deploy}"

if [[ "${EUID}" -ne 0 ]]; then
  echo "Run as root." >&2
  exit 1
fi
id "${DEPLOY_USER}" >/dev/null 2>&1 || { echo "Missing ${DEPLOY_USER}; run bootstrap-ubuntu.sh first." >&2; exit 1; }

install -d -m 0755 /opt/qira/bin
install -m 0755 "${SOURCE_DIR}/scripts/deploy.sh" /opt/qira/bin/deploy.sh
install -m 0755 "${SOURCE_DIR}/scripts/rollback.sh" /opt/qira/bin/rollback.sh
install -m 0755 "${SOURCE_DIR}/scripts/preflight.sh" /opt/qira/bin/preflight.sh
install -m 0755 "${SOURCE_DIR}/scripts/backup-config.sh" /opt/qira/bin/backup-config.sh
chown -R root:root /opt/qira/bin

# Deployment user may execute the app-level scripts, but cannot modify them.
echo "Installed QIRA VPS operational scripts in /opt/qira/bin."
