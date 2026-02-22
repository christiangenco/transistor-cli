# transistor-cli

Manage Transistor.fm podcasts: shows, episodes, analytics, subscribers, webhooks.

## Commands

```bash
transistor-cli me                                    # Authenticated user info
transistor-cli shows list [--query Q] [--private]    # List shows
transistor-cli shows get <id>                        # Get show by ID/slug
transistor-cli shows update <id> [--title T] ...     # Update show metadata

transistor-cli episodes list --show <id> [--status published|draft|scheduled] [--per N]
transistor-cli episodes get <id>                     # Get episode details
transistor-cli episodes create --show <id> --title "T" [--audio-file /path.mp3] [--publish]
transistor-cli episodes update <id> [--title T] [--description HTML] ...
transistor-cli episodes publish <id> --status published|scheduled|draft [--published-at DATETIME]

transistor-cli analytics show <showId> [--start dd-mm-yyyy] [--end dd-mm-yyyy]
transistor-cli analytics episodes <showId> [--start dd-mm-yyyy] [--end dd-mm-yyyy]
transistor-cli analytics episode <episodeId> [--start dd-mm-yyyy] [--end dd-mm-yyyy]

transistor-cli subscribers list --show <id>          # List private podcast subscribers
transistor-cli subscribers create --show <id> --email E [--skip-welcome-email]
transistor-cli subscribers delete --id <id>          # Or: --show <id> --email E

transistor-cli webhooks list --show <id>
transistor-cli webhooks create --show <id> --event episode_published --url URL
transistor-cli webhooks delete <id>
```

## Examples

```bash
# List all shows
transistor-cli shows list

# Create episode with local audio upload + auto-publish
transistor-cli episodes create --show 15816 --title "Episode 131" \
  --audio-file ~/recording.mp3 --summary "Latest episode" --publish

# Create episode from URL
transistor-cli episodes create --show 15816 --title "Episode 131" \
  --audio-url "https://example.com/audio.mp3" --increment-number

# Get last 30 days of show analytics
transistor-cli analytics show 5861 --start 22-01-2026 --end 21-02-2026

# Update episode metadata
transistor-cli episodes update 2366777 --title "New Title" --keywords "a,b,c"

# Schedule an episode
transistor-cli episodes publish 12345 --status scheduled --published-at "2026-03-01 09:00"
```

## Shows

| ID | Title |
|----|-------|
| 5861 | Your Thoughts |
| 15816 | Makers.dev |
| 37070 | What's Stopping You? |
| 9004 | PSLove |
| 18782 | GCM |

Requires `.env` with `TRANSISTOR_API_KEY`. See `.env.example`.

Add `--pretty` to any command for formatted JSON output.
