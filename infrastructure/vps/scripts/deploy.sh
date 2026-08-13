#!/usr/bin/env bash
set -Eeuo pipefail

APP_DIR="${1:-}"
NEW_IMAGE="${2:-}"

if [[ -z "${APP_DIR}" || -z "${NEW_IMAGE}" ]]; then
  echo "Usage: deploy.sh /opt/qira/apps/<customer> <immutable-image-tag>" >&2
  exit 2
fi

case "${APP_DIR}" in
  /opt/qira/apps/*) ;;
  *) echo "Refusing to deploy outside /opt/qira/apps/." >&2; exit 2 ;;
esac

if [[ ! -f "${APP_DIR}/compose.yaml" || ! -f "${APP_DIR}/.env" ]]; then
  echo "Missing compose.yaml or .env in ${APP_DIR}." >&2
  exit 1
fi

if [[ "${NEW_IMAGE}" == *":latest" || "${NEW_IMAGE}" != *":"* ]]; then
  echo "Use an immutable/versioned image tag, not latest." >&2
  exit 2
fi

cd "${APP_DIR}"
chmod 600 .env

current_image="$(awk -F= '$1=="APP_IMAGE" {sub(/^APP_IMAGE=/,""); print; exit}' .env || true)"
if [[ -n "${current_image}" ]]; then
  printf '%s\n' "${current_image}" > .previous-image
fi

escape_sed() { printf '%s' "$1" | sed -e 's/[\\&|]/\\&/g'; }
if grep -q '^APP_IMAGE=' .env; then
  sed -i "s|^APP_IMAGE=.*$|APP_IMAGE=$(escape_sed "${NEW_IMAGE}")|" .env
else
  printf '\nAPP_IMAGE=%s\n' "${NEW_IMAGE}" >> .env
fi

docker compose config --quiet
docker compose pull app
docker compose up -d --no-deps app

container_id="$(docker compose ps -q app)"
if [[ -z "${container_id}" ]]; then
  echo "Application container did not start." >&2
  exit 1
fi

for attempt in {1..30}; do
  status="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "${container_id}" 2>/dev/null || true)"
  if [[ "${status}" == "healthy" ]]; then
    printf '%s\n' "${NEW_IMAGE}" > .current-image
    echo "Deployment healthy: ${NEW_IMAGE}"
    docker image prune -f >/dev/null 2>&1 || true
    exit 0
  fi
  if [[ "${status}" == "unhealthy" || "${status}" == "exited" || "${status}" == "dead" ]]; then
    break
  fi
  sleep 2
done

echo "Health check failed for ${NEW_IMAGE}." >&2
if [[ -s .previous-image ]]; then
  previous="$(cat .previous-image)"
  echo "Attempting automatic rollback to ${previous}." >&2
  sed -i "s|^APP_IMAGE=.*$|APP_IMAGE=$(escape_sed "${previous}")|" .env
  docker compose pull app || true
  docker compose up -d --no-deps app || true
fi
exit 1
