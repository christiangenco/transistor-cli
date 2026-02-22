# transistor-cli

CLI tool for managing [Transistor.fm](https://transistor.fm) podcasts — shows, episodes, audio uploads, analytics, subscribers, and webhooks.

## Prerequisites

- Node.js 20+
- A Transistor.fm account with API access

## Setup

```bash
cd ~/tools/transistor-cli
npm install
npm run build
npm link        # makes `transistor-cli` globally available
```

### Credentials

Get your API key from [dashboard.transistor.fm/account](https://dashboard.transistor.fm/account) → **API Access**.

```bash
cp .env.example .env
# Edit .env and set TRANSISTOR_API_KEY=your_key
```

Or symlink to the shared tools `.env`:

```bash
ln -s ../.env .env
```

## Command Reference

All commands output JSON to stdout: `{"ok": true, "data": {...}}` on success, `{"ok": false, "error": "..."}` on failure. Add `--pretty` for formatted output.

### User

```bash
transistor-cli me                    # Get authenticated user info
```

### Shows

```bash
transistor-cli shows list            # List all shows
transistor-cli shows list --query "search" --private --page 1 --per 5
transistor-cli shows get <id>        # Get show by ID or slug
transistor-cli shows update <id>     # Update show metadata
  --title --author --description --category --secondary-category
  --language --copyright --keywords --explicit --website --image-url
  --owner-email --show-type
```

### Episodes

```bash
transistor-cli episodes list --show <id>
  [--query Q] [--status published|draft|scheduled]
  [--order desc|asc] [--page N] [--per N]

transistor-cli episodes get <id>

transistor-cli episodes create --show <id>
  [--title T] [--summary S] [--description HTML]
  [--audio-file /path/to/file.mp3]   # Upload local audio
  [--audio-url URL]                   # Or use a public URL
  [--author A] [--number N] [--season N] [--type full|trailer|bonus]
  [--explicit] [--keywords "a,b,c"] [--image-url URL]
  [--alternate-url URL] [--video-url URL] [--transcript-text TEXT]
  [--increment-number] [--email-notifications]
  [--publish]                         # Publish immediately

transistor-cli episodes update <id>
  # Same fields as create (except --show, --increment-number, --publish)

transistor-cli episodes publish <id>
  --status published|scheduled|draft
  [--published-at "2026-03-01 09:00"]  # For scheduling
```

### Analytics

All date parameters use `dd-mm-yyyy` format. Defaults: show = 14 days, episodes = 7 days.

```bash
transistor-cli analytics show <showId>
  [--start dd-mm-yyyy] [--end dd-mm-yyyy]

transistor-cli analytics episodes <showId>     # All episodes of a show
  [--start dd-mm-yyyy] [--end dd-mm-yyyy]

transistor-cli analytics episode <episodeId>   # Single episode
  [--start dd-mm-yyyy] [--end dd-mm-yyyy]
```

### Subscribers (Private Podcasts)

```bash
transistor-cli subscribers list --show <id>
  [--query Q] [--page N] [--per N]

transistor-cli subscribers get <id>

transistor-cli subscribers create --show <id> --email user@example.com
  [--skip-welcome-email]

transistor-cli subscribers create-batch --show <id>
  --emails user1@example.com user2@example.com
  [--skip-welcome-email]

transistor-cli subscribers update <id> --email new@example.com

transistor-cli subscribers delete --id <id>
transistor-cli subscribers delete --show <id> --email user@example.com
```

### Webhooks

```bash
transistor-cli webhooks list --show <id>

transistor-cli webhooks create --show <id>
  --event episode_created|episode_published|subscriber_created|subscriber_deleted
  --url https://example.com/webhook

transistor-cli webhooks delete <id>
```

## Audio Upload Flow

When using `--audio-file` with `episodes create` or `episodes update`, the CLI:

1. Calls `GET /v1/episodes/authorize_upload` with the filename
2. Uploads the file via HTTP PUT to the returned presigned S3 URL
3. Uses the resulting `audio_url` when creating/updating the episode

For files already hosted publicly, use `--audio-url` instead.

## How It Works

- **API**: [Transistor REST API v1](https://developers.transistor.fm/) (JSON:API format)
- **Auth**: API key via `x-api-key` header
- **Rate limit**: 10 requests per 10 seconds (429 → blocked for 10s)
- **Output**: JSON:API responses are flattened (id + attributes merged, relationship IDs inlined)

## Development

```bash
npm run dev -- me --pretty     # Run via tsx without building
npm run build                  # Compile TypeScript
```
