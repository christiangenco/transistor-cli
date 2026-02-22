import { Command } from "commander";
import { setPretty } from "./output.js";

const program = new Command();

program
  .name("transistor-cli")
  .description("CLI tool for managing Transistor.fm podcasts")
  .version("1.0.0")
  .option("--pretty", "Human-readable formatted output")
  .hook("preAction", () => {
    if (program.opts().pretty) setPretty(true);
  });

// --- me ---
program
  .command("me")
  .description("Get authenticated user info")
  .action(async () => {
    const { getMe } = await import("./commands/me.js");
    await getMe();
  });

// --- shows ---
const shows = program.command("shows").description("Manage podcasts/shows");

shows
  .command("list")
  .description("List all shows")
  .option("--query <q>", "Search query")
  .option("--private", "Filter for private shows")
  .option("--page <n>", "Page number", parseInt)
  .option("--per <n>", "Results per page", parseInt)
  .action(async (opts) => {
    const { listShows } = await import("./commands/shows.js");
    await listShows(opts);
  });

shows
  .command("get <id>")
  .description("Get a single show by ID or slug")
  .action(async (id: string) => {
    const { getShow } = await import("./commands/shows.js");
    await getShow(id);
  });

shows
  .command("update <id>")
  .description("Update a show")
  .option("--title <title>", "Podcast title")
  .option("--author <author>", "Podcast author")
  .option("--description <desc>", "Podcast description")
  .option("--category <cat>", "Primary category")
  .option("--secondary-category <cat>", "Secondary category")
  .option("--language <lang>", "Spoken language code")
  .option("--copyright <text>", "Copyright information")
  .option("--keywords <kw>", "Comma-separated keywords")
  .option("--explicit", "Contains explicit content")
  .option("--no-explicit", "Does not contain explicit content")
  .option("--website <url>", "Podcast website URL")
  .option("--image-url <url>", "Podcast artwork image URL")
  .option("--owner-email <email>", "Owner email")
  .option("--show-type <type>", "episodic or serial")
  .action(async (id: string, opts) => {
    const { updateShow } = await import("./commands/shows.js");
    const fields: Record<string, any> = {};
    if (opts.title !== undefined) fields.title = opts.title;
    if (opts.author !== undefined) fields.author = opts.author;
    if (opts.description !== undefined) fields.description = opts.description;
    if (opts.category !== undefined) fields.category = opts.category;
    if (opts.secondaryCategory !== undefined)
      fields.secondary_category = opts.secondaryCategory;
    if (opts.language !== undefined) fields.language = opts.language;
    if (opts.copyright !== undefined) fields.copyright = opts.copyright;
    if (opts.keywords !== undefined) fields.keywords = opts.keywords;
    if (opts.explicit !== undefined) fields.explicit = opts.explicit;
    if (opts.website !== undefined) fields.website = opts.website;
    if (opts.imageUrl !== undefined) fields.image_url = opts.imageUrl;
    if (opts.ownerEmail !== undefined) fields.owner_email = opts.ownerEmail;
    if (opts.showType !== undefined) fields.show_type = opts.showType;
    await updateShow(id, fields);
  });

// --- episodes ---
const episodes = program.command("episodes").description("Manage episodes");

episodes
  .command("list")
  .description("List episodes")
  .option("--show <id>", "Show ID or slug")
  .option("--query <q>", "Search query")
  .option("--status <status>", "Filter by status: published, scheduled, draft")
  .option("--order <order>", "Sort order: desc (newest first) or asc")
  .option("--page <n>", "Page number", parseInt)
  .option("--per <n>", "Results per page", parseInt)
  .action(async (opts) => {
    const { listEpisodes } = await import("./commands/episodes.js");
    await listEpisodes({
      showId: opts.show,
      query: opts.query,
      status: opts.status,
      order: opts.order,
      page: opts.page,
      per: opts.per,
    });
  });

episodes
  .command("get <id>")
  .description("Get a single episode by ID")
  .action(async (id: string) => {
    const { getEpisode } = await import("./commands/episodes.js");
    await getEpisode(id);
  });

episodes
  .command("create")
  .description("Create a new episode (draft by default)")
  .requiredOption("--show <id>", "Show ID or slug")
  .option("--title <title>", "Episode title")
  .option("--summary <text>", "Short summary")
  .option("--description <html>", "Longer description (HTML ok)")
  .option("--audio-url <url>", "URL to audio file")
  .option("--audio-file <path>", "Local audio file to upload")
  .option("--author <name>", "Episode author")
  .option("--number <n>", "Episode number", parseInt)
  .option("--season <n>", "Season number", parseInt)
  .option("--type <type>", "full, trailer, or bonus")
  .option("--explicit", "Contains explicit content")
  .option("--keywords <kw>", "Comma-separated keywords")
  .option("--image-url <url>", "Episode artwork URL")
  .option("--alternate-url <url>", "Alternate episode URL")
  .option("--video-url <url>", "YouTube video URL")
  .option("--transcript-text <text>", "Full transcript text")
  .option("--increment-number", "Auto-set episode number")
  .option("--email-notifications", "Send email notifications (private podcasts)")
  .option("--publish", "Publish immediately after creating")
  .action(async (opts) => {
    const { createEpisode } = await import("./commands/episodes.js");
    await createEpisode({
      showId: opts.show,
      title: opts.title,
      summary: opts.summary,
      description: opts.description,
      audioUrl: opts.audioUrl,
      audioFile: opts.audioFile,
      author: opts.author,
      number: opts.number,
      season: opts.season,
      type: opts.type,
      explicit: opts.explicit,
      keywords: opts.keywords,
      imageUrl: opts.imageUrl,
      alternateUrl: opts.alternateUrl,
      videoUrl: opts.videoUrl,
      transcriptText: opts.transcriptText,
      incrementNumber: opts.incrementNumber,
      emailNotifications: opts.emailNotifications,
      publish: opts.publish,
    });
  });

episodes
  .command("update <id>")
  .description("Update an episode")
  .option("--title <title>", "Episode title")
  .option("--summary <text>", "Short summary")
  .option("--description <html>", "Longer description (HTML ok)")
  .option("--audio-url <url>", "URL to new audio file")
  .option("--audio-file <path>", "Local audio file to upload")
  .option("--author <name>", "Episode author")
  .option("--number <n>", "Episode number", parseInt)
  .option("--season <n>", "Season number", parseInt)
  .option("--type <type>", "full, trailer, or bonus")
  .option("--explicit", "Contains explicit content")
  .option("--no-explicit", "Not explicit")
  .option("--keywords <kw>", "Comma-separated keywords")
  .option("--image-url <url>", "Episode artwork URL")
  .option("--alternate-url <url>", "Alternate episode URL")
  .option("--video-url <url>", "YouTube video URL")
  .option("--transcript-text <text>", "Full transcript text")
  .option("--email-notifications", "Send email notifications")
  .action(async (id: string, opts) => {
    const { updateEpisode } = await import("./commands/episodes.js");
    await updateEpisode(id, {
      title: opts.title,
      summary: opts.summary,
      description: opts.description,
      audioUrl: opts.audioUrl,
      audioFile: opts.audioFile,
      author: opts.author,
      number: opts.number,
      season: opts.season,
      type: opts.type,
      explicit: opts.explicit,
      keywords: opts.keywords,
      imageUrl: opts.imageUrl,
      alternateUrl: opts.alternateUrl,
      videoUrl: opts.videoUrl,
      transcriptText: opts.transcriptText,
      emailNotifications: opts.emailNotifications,
    });
  });

episodes
  .command("publish <id>")
  .description("Publish, schedule, or unpublish an episode")
  .requiredOption(
    "--status <status>",
    "published, scheduled, or draft"
  )
  .option("--published-at <datetime>", "Publishing date/time (for scheduling)")
  .action(async (id: string, opts) => {
    const { publishEpisode } = await import("./commands/episodes.js");
    await publishEpisode(id, opts.status, opts.publishedAt);
  });

// --- analytics ---
const analytics = program
  .command("analytics")
  .description("Download analytics");

analytics
  .command("show <id>")
  .description("Get download analytics for a show (default: last 14 days)")
  .option("--start <date>", "Start date (dd-mm-yyyy)")
  .option("--end <date>", "End date (dd-mm-yyyy)")
  .action(async (id: string, opts) => {
    const { showAnalytics } = await import("./commands/analytics.js");
    await showAnalytics(id, opts);
  });

analytics
  .command("episodes <showId>")
  .description(
    "Get download analytics for all episodes of a show (default: last 7 days)"
  )
  .option("--start <date>", "Start date (dd-mm-yyyy)")
  .option("--end <date>", "End date (dd-mm-yyyy)")
  .action(async (showId: string, opts) => {
    const { allEpisodesAnalytics } = await import("./commands/analytics.js");
    await allEpisodesAnalytics(showId, opts);
  });

analytics
  .command("episode <id>")
  .description(
    "Get download analytics for a single episode (default: last 14 days)"
  )
  .option("--start <date>", "Start date (dd-mm-yyyy)")
  .option("--end <date>", "End date (dd-mm-yyyy)")
  .action(async (id: string, opts) => {
    const { episodeAnalytics } = await import("./commands/analytics.js");
    await episodeAnalytics(id, opts);
  });

// --- subscribers ---
const subscribers = program
  .command("subscribers")
  .description("Manage private podcast subscribers");

subscribers
  .command("list")
  .description("List subscribers for a show")
  .requiredOption("--show <id>", "Show ID or slug")
  .option("--query <q>", "Search query")
  .option("--page <n>", "Page number", parseInt)
  .option("--per <n>", "Results per page", parseInt)
  .action(async (opts) => {
    const { listSubscribers } = await import("./commands/subscribers.js");
    await listSubscribers({
      showId: opts.show,
      query: opts.query,
      page: opts.page,
      per: opts.per,
    });
  });

subscribers
  .command("get <id>")
  .description("Get a single subscriber by ID")
  .action(async (id: string) => {
    const { getSubscriber } = await import("./commands/subscribers.js");
    await getSubscriber(id);
  });

subscribers
  .command("create")
  .description("Add a subscriber to a private podcast")
  .requiredOption("--show <id>", "Show ID or slug")
  .requiredOption("--email <email>", "Subscriber email address")
  .option("--skip-welcome-email", "Don't send welcome email")
  .action(async (opts) => {
    const { createSubscriber } = await import("./commands/subscribers.js");
    await createSubscriber({
      showId: opts.show,
      email: opts.email,
      skipWelcomeEmail: opts.skipWelcomeEmail,
    });
  });

subscribers
  .command("create-batch")
  .description("Add multiple subscribers to a private podcast")
  .requiredOption("--show <id>", "Show ID or slug")
  .requiredOption("--emails <emails...>", "Email addresses (space-separated)")
  .option("--skip-welcome-email", "Don't send welcome emails")
  .action(async (opts) => {
    const { createSubscribersBatch } = await import(
      "./commands/subscribers.js"
    );
    await createSubscribersBatch({
      showId: opts.show,
      emails: opts.emails,
      skipWelcomeEmail: opts.skipWelcomeEmail,
    });
  });

subscribers
  .command("update <id>")
  .description("Update a subscriber's email")
  .requiredOption("--email <email>", "New email address")
  .action(async (id: string, opts) => {
    const { updateSubscriber } = await import("./commands/subscribers.js");
    await updateSubscriber(id, opts.email);
  });

subscribers
  .command("delete")
  .description("Delete a subscriber by email or ID")
  .option("--show <id>", "Show ID (required with --email)")
  .option("--email <email>", "Subscriber email")
  .option("--id <id>", "Subscriber ID")
  .action(async (opts) => {
    if (opts.id) {
      const { deleteSubscriberById } = await import(
        "./commands/subscribers.js"
      );
      await deleteSubscriberById(opts.id);
    } else if (opts.show && opts.email) {
      const { deleteSubscriberByEmail } = await import(
        "./commands/subscribers.js"
      );
      await deleteSubscriberByEmail(opts.show, opts.email);
    } else {
      console.error(
        "Error: provide --id, or both --show and --email"
      );
      process.exit(1);
    }
  });

// --- webhooks ---
const webhooks = program
  .command("webhooks")
  .description("Manage webhooks");

webhooks
  .command("list")
  .description("List webhooks for a show")
  .requiredOption("--show <id>", "Show ID or slug")
  .action(async (opts) => {
    const { listWebhooks } = await import("./commands/webhooks.js");
    await listWebhooks(opts.show);
  });

webhooks
  .command("create")
  .description("Subscribe to a webhook event")
  .requiredOption("--show <id>", "Show ID or slug")
  .requiredOption(
    "--event <name>",
    "Event name: episode_created, episode_published, subscriber_created, subscriber_deleted"
  )
  .requiredOption("--url <url>", "Target URL for webhook delivery")
  .action(async (opts) => {
    const { createWebhook } = await import("./commands/webhooks.js");
    await createWebhook({
      showId: opts.show,
      eventName: opts.event,
      url: opts.url,
    });
  });

webhooks
  .command("delete <id>")
  .description("Unsubscribe from a webhook")
  .action(async (id: string) => {
    const { deleteWebhook } = await import("./commands/webhooks.js");
    await deleteWebhook(id);
  });

program.parse();
