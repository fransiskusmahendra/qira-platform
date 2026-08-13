#!/usr/bin/env bash
set -Eeuo pipefail

APP_DIR="${1:-}"
if [[ -z "${APP_DIR}" ]]; then
  echo "Usage: preflight.sh /opt/qira/apps/<customer>" >&2
  exit 2
fi
case "${APP_DIR}" in
  /opt/qira/apps/*) ;;
  *) echo "Refusing to inspect outside /opt/qira/apps/." >&2; exit 2 ;;
esac

fail=0
check() {
  local label="$1"; shift
  if "$@" >/dev/null 2>&1; then printf 'PASS  %s\n' "${label}"; else printf 'FAIL  %s\n' "${label}"; fail=1; fi
}

check "Docker daemon" docker info
check "Docker Compose" docker compose version
check "Caddy service" systemctl is-active --quiet caddy
check "UFW enabled" bash -c "ufw status | grep -q '^Status: active'"
check "fail2ban active" systemctl is-active --quiet fail2ban
check "compose.yaml exists" test -f "${APP_DIR}/compose.yaml"
check ".env exists" test -f "${APP_DIR}/.env"

if [[ -f "${APP_DIR}/.env" ]]; then
  mode="$(stat -c '%a' "${APP_DIR}/.env")"
  if [[ "${mode}" == "600" || "${mode}" == "400" ]]; then printf 'PASS  .env permissions\n'; else printf 'FAIL  .env permissions are %s (expected 600/400)\n' "${mode}"; fail=1; fi
fi

if [[ -f "${APP_DIR}/compose.yaml" && -f "${APP_DIR}/.env" ]]; then
  check "Compose config valid" bash -c "cd '${APP_DIR}' && docker compose config --quiet"
  if bash -c "cd '${APP_DIR}' && docker compose config" 2>/dev/null | grep -Eq 'published: "?(80|443|3000)"?.*host_ip: "?0\.0\.0\.0|host_ip: "?0\.0\.0\.0.*published:'; then
    printf 'FAIL  application appears publicly bound\n'; fail=1
  else
    printf 'PASS  no obvious public application binding\n'
  fi
fi

if caddy validate --config /etc/caddy/Caddyfile >/dev/null 2>&1; then printf 'PASS  Caddy config valid\n'; else printf 'FAIL  Caddy config invalid\n'; fail=1; fi

exit "${fail}"
