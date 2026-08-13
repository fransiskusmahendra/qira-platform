#!/usr/bin/env bash
set -Eeuo pipefail

APP_DIR="${1:-}"
TARGET_IMAGE="${2:-}"

if [[ -z "${APP_DIR}" ]]; then
  echo "Usage: rollback.sh /opt/qira/apps/<customer> [target-image]" >&2
  exit 2
fi
case "${APP_DIR}" in
  /opt/qira/apps/*) ;;
  *) echo "Refusing to operate outside /opt/qira/apps/." >&2; exit 2 ;;
esac

cd "${APP_DIR}"
if [[ -z "${TARGET_IMAGE}" ]]; then
  [[ -s .previous-image ]] || { echo "No recorded previous image." >&2; exit 1; }
  TARGET_IMAGE="$(cat .previous-image)"
fi

if [[ "${TARGET_IMAGE}" == *":latest" || "${TARGET_IMAGE}" != *":"* ]]; then
  echo "Rollback target must be an immutable/versioned image tag." >&2
  exit 2
fi

escape_sed() { printf '%s' "$1" | sed -e 's/[\\&|]/\\&/g'; }
current="$(awk -F= '$1=="APP_IMAGE" {sub(/^APP_IMAGE=/,""); print; exit}' .env || true)"
[[ -n "${current}" ]] && printf '%s\n' "${current}" > .rollback-from-image
sed -i "s|^APP_IMAGE=.*$|APP_IMAGE=$(escape_sed "${TARGET_IMAGE}")|" .env
chmod 600 .env

docker compose config --quiet
docker compose pull app
docker compose up -d --no-deps app

container_id="$(docker compose ps -q app)"
for attempt in {1..30}; do
  status="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "${container_id}" 2>/dev/null || true)"
  if [[ "${status}" == "healthy" ]]; then
    printf '%s\n' "${TARGET_IMAGE}" > .current-image
    echo "Rollback healthy: ${TARGET_IMAGE}"
    exit 0
  fi
  if [[ "${status}" == "unhealthy" || "${status}" == "exited" || "${status}" == "dead" ]]; then break; fi
  sleep 2
done

echo "Rollback target failed health check; manual intervention required." >&2
exit 1
