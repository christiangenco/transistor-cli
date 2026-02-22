import { apiGet, apiPost, apiPatch, getClient } from "../api.js";
import { success, fail } from "../output.js";
import { readFileSync } from "fs";
import { basename } from "path";
import { lookup } from "mime-types";
import axios from "axios";

export async function listEpisodes(opts: {
  showId?: string;
  query?: string;
  status?: string;
  order?: string;
  page?: number;
  per?: number;
}) {
  const params: Record<string, any> = {};
  if (opts.showId) params.show_id = opts.showId;
  if (opts.query) params.query = opts.query;
  if (opts.status) params.status = opts.status;
  if (opts.order) params.order = opts.order;
  if (opts.page !== undefined) params["pagination[page]"] = opts.page;
  if (opts.per !== undefined) params["pagination[per]"] = opts.per;

  const data = await apiGet("/episodes", params);
  success(data);
}

export async function getEpisode(id: string) {
  const data = await apiGet(`/episodes/${id}`);
  success(data);
}

export async function createEpisode(opts: {
  showId: string;
  title?: string;
  summary?: string;
  description?: string;
  audioUrl?: string;
  audioFile?: string;
  author?: string;
  number?: number;
  season?: number;
  type?: string;
  explicit?: boolean;
  keywords?: string;
  imageUrl?: string;
  alternateUrl?: string;
  videoUrl?: string;
  transcriptText?: string;
  incrementNumber?: boolean;
  emailNotifications?: boolean;
  publish?: boolean;
}) {
  let audioUrl = opts.audioUrl;

  // If local file provided, upload it first
  if (opts.audioFile) {
    audioUrl = await uploadAudioFile(opts.audioFile);
  }

  const episode: Record<string, any> = { show_id: opts.showId };
  if (opts.title) episode.title = opts.title;
  if (opts.summary) episode.summary = opts.summary;
  if (opts.description) episode.description = opts.description;
  if (audioUrl) episode.audio_url = audioUrl;
  if (opts.author) episode.author = opts.author;
  if (opts.number !== undefined) episode.number = opts.number;
  if (opts.season !== undefined) episode.season = opts.season;
  if (opts.type) episode.type = opts.type;
  if (opts.explicit !== undefined) episode.explicit = opts.explicit;
  if (opts.keywords) episode.keywords = opts.keywords;
  if (opts.imageUrl) episode.image_url = opts.imageUrl;
  if (opts.alternateUrl) episode.alternate_url = opts.alternateUrl;
  if (opts.videoUrl) episode.video_url = opts.videoUrl;
  if (opts.transcriptText) episode.transcript_text = opts.transcriptText;
  if (opts.incrementNumber !== undefined)
    episode.increment_number = opts.incrementNumber;
  if (opts.emailNotifications !== undefined)
    episode.email_notifications = opts.emailNotifications;

  const data = await apiPost("/episodes", { episode });

  // Auto-publish if requested
  if (opts.publish && data?.id) {
    const pubData = await apiPatch(`/episodes/${data.id}/publish`, {
      episode: { status: "published" },
    });
    success(pubData);
    return;
  }

  success(data);
}

export async function updateEpisode(
  id: string,
  fields: Record<string, any>
) {
  const episode: Record<string, any> = {};
  const fieldMap: Record<string, string> = {
    title: "title",
    summary: "summary",
    description: "description",
    audioUrl: "audio_url",
    author: "author",
    number: "number",
    season: "season",
    type: "type",
    explicit: "explicit",
    keywords: "keywords",
    imageUrl: "image_url",
    alternateUrl: "alternate_url",
    videoUrl: "video_url",
    transcriptText: "transcript_text",
    emailNotifications: "email_notifications",
  };

  // Handle local audio file upload
  if (fields.audioFile) {
    const audioUrl = await uploadAudioFile(fields.audioFile);
    episode.audio_url = audioUrl;
  }

  for (const [jsKey, apiKey] of Object.entries(fieldMap)) {
    if (fields[jsKey] !== undefined) {
      episode[apiKey] = fields[jsKey];
    }
  }

  const data = await apiPatch(`/episodes/${id}`, { episode });
  success(data);
}

export async function publishEpisode(
  id: string,
  status: string,
  publishedAt?: string
) {
  const episode: Record<string, any> = { status };
  if (publishedAt) episode.published_at = publishedAt;
  const data = await apiPatch(`/episodes/${id}/publish`, { episode });
  success(data);
}

async function uploadAudioFile(filePath: string): Promise<string> {
  const filename = basename(filePath);
  const contentType = lookup(filePath) || "audio/mpeg";

  process.stderr.write(`Authorizing upload for ${filename}...\n`);

  // Step 1: Get presigned URL
  const authData = await apiGet("/episodes/authorize_upload", { filename });
  const uploadUrl = authData.upload_url;
  const audioUrl = authData.audio_url;

  if (!uploadUrl) {
    fail("Failed to get upload URL from Transistor");
  }

  // Step 2: Read file and PUT to S3
  process.stderr.write(`Uploading ${filename}...\n`);
  const fileBuffer = readFileSync(filePath);

  await axios.put(uploadUrl, fileBuffer, {
    headers: { "Content-Type": contentType },
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
    timeout: 600000, // 10 min for large files
  });

  process.stderr.write(`Upload complete. audio_url: ${audioUrl}\n`);
  return audioUrl;
}
