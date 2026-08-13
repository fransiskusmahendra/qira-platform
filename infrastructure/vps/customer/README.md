# Customer VPS stack template

Create one directory per customer under `/opt/qira/apps/<customer-slug>`.

## Provision

```bash
install -d -m 0750 -o qira-deploy -g qira-deploy /opt/qira/apps/customer-a
cp compose.yaml /opt/qira/apps/customer-a/compose.yaml
cp .env.example /opt/qira/apps/customer-a/.env
chmod 600 /opt/qira/apps/customer-a/.env
```

Edit the server-side `.env` with the approved immutable image tag, a unique loopback host port, resource limits, public configuration, and required server-only secrets.

Never reuse another customer's `.env` blindly. Never commit the production `.env`.

## Port allocation

Maintain a simple allocation record in QIRA managed-service records. Suggested initial range: `3101-3199`. The port is an internal host implementation detail and is not exposed publicly.

Example:

```text
customer-a -> 3101
customer-b -> 3102
```

Caddy maps each customer hostname to its allocated loopback port.

## Start manually for first activation

```bash
cd /opt/qira/apps/customer-a
docker compose config --quiet
docker compose pull
docker compose up -d
docker compose ps
```

Verify the local health endpoint before DNS cutover:

```bash
curl --fail --silent http://127.0.0.1:3101/api/health
```

## Release automation

After first activation, GitHub Actions should call:

```bash
/opt/qira/bin/deploy.sh /opt/qira/apps/customer-a ghcr.io/OWNER/IMAGE:COMMIT_SHA
```

The deploy script records the previous image and attempts automatic rollback if the new container fails its health check.

## Customer isolation

For shared VPS use, each customer must have:

- unique app directory;
- unique container name/slug;
- unique loopback host port;
- independent `.env`;
- independent domain/Caddy site block;
- explicit CPU/memory limits;
- separate database tenant/project/schema strategy appropriate to the application;
- separate backup/restore identification;
- release history tied to the customer project.

A Docker container is not a substitute for contractual or regulatory isolation. Use a dedicated VPS when required.
