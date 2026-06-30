// Uploads real product photos into the public "products" Supabase Storage
// bucket and writes each public URL back onto the matching product row.
//
// Usage:
//   1. Make sure 0001_init.sql, 0002_product_category_and_photos.sql, and
//      seed.sql have all been run against your Supabase project.
//   2. Put your keys in .env.local (NEXT_PUBLIC_SUPABASE_URL and
//      SUPABASE_SERVICE_ROLE_KEY).
//   3. Drop one photo per product into the product-photos/ folder, named after
//      the product slug, for example: something-blue-bouquet.jpg
//      (see product-photos/MANIFEST.md for the full slug list).
//   4. Run: npm run upload:photos
//
// Re-running is safe: each upload is an upsert, so updated photos overwrite the
// old ones and image_url is refreshed.

import { createClient } from "@supabase/supabase-js";
import { readFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PHOTO_DIR = path.join(ROOT, "product-photos");
const BUCKET = "products";

const CONTENT_TYPES = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
};

// Minimal .env.local loader so this script needs no extra dependency.
async function loadEnv() {
  const envPath = path.join(ROOT, ".env.local");
  if (!existsSync(envPath)) return;
  const raw = await readFile(envPath, "utf8");
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

async function main() {
  await loadEnv();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    console.error(
      "Missing config. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local."
    );
    process.exit(1);
  }

  if (!existsSync(PHOTO_DIR)) {
    console.error(`No product-photos/ folder found at ${PHOTO_DIR}.`);
    process.exit(1);
  }

  const supabase = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // Make sure the public bucket exists (the migration also creates it).
  const { data: buckets } = await supabase.storage.listBuckets();
  if (!buckets?.some((b) => b.id === BUCKET)) {
    const { error } = await supabase.storage.createBucket(BUCKET, { public: true });
    if (error) {
      console.error(`Could not create the "${BUCKET}" bucket:`, error.message);
      process.exit(1);
    }
    console.log(`Created public bucket "${BUCKET}".`);
  }

  // Map known product slugs so we can warn about photos that do not match one.
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("slug");
  if (productsError) {
    console.error("Could not read products:", productsError.message);
    process.exit(1);
  }
  const knownSlugs = new Set((products ?? []).map((p) => p.slug));

  const entries = await readdir(PHOTO_DIR, { withFileTypes: true });
  const photoFiles = entries
    .filter((e) => e.isFile() && CONTENT_TYPES[extOf(e.name)])
    .map((e) => e.name);

  if (photoFiles.length === 0) {
    console.error(
      "No image files in product-photos/. Add files named <slug>.jpg (see MANIFEST.md)."
    );
    process.exit(1);
  }

  let uploaded = 0;
  let skipped = 0;
  const matchedSlugs = new Set();

  for (const file of photoFiles) {
    const ext = extOf(file);
    const slug = path.basename(file, path.extname(file)).toLowerCase();
    const contentType = CONTENT_TYPES[ext];

    if (!knownSlugs.has(slug)) {
      console.warn(`! ${file}: no product with slug "${slug}", skipping.`);
      skipped++;
      continue;
    }

    const body = await readFile(path.join(PHOTO_DIR, file));
    const objectName = `${slug}${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(objectName, body, { contentType, upsert: true });
    if (uploadError) {
      console.error(`x ${file}: upload failed: ${uploadError.message}`);
      skipped++;
      continue;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET).getPublicUrl(objectName);

    const { error: updateError } = await supabase
      .from("products")
      .update({ image_url: publicUrl })
      .eq("slug", slug);
    if (updateError) {
      console.error(`x ${slug}: could not set image_url: ${updateError.message}`);
      skipped++;
      continue;
    }

    console.log(`+ ${slug} -> ${publicUrl}`);
    matchedSlugs.add(slug);
    uploaded++;
  }

  const missing = [...knownSlugs].filter((s) => !matchedSlugs.has(s)).sort();
  console.log(`\nDone. Uploaded ${uploaded}, skipped ${skipped}.`);
  if (missing.length > 0) {
    console.log(
      `\n${missing.length} product(s) still have no photo (add <slug>.jpg for each):`
    );
    for (const s of missing) console.log(`  - ${s}`);
  }
}

function extOf(name) {
  return path.extname(name).toLowerCase();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
