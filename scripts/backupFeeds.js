// scripts/backupFeeds.js

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET = process.env.S3_BUCKET_NAME;

async function backupFeedsToS3() {
  const basePath = './feeds';

  if (!fs.existsSync(basePath)) {
    console.error(`❌ Feeds directory not found: ${basePath}`);
    return;
  }

  const files = fs.readdirSync(basePath)
    .filter((f) => fs.statSync(path.join(basePath, f)).isFile())
    .sort(
      (a, b) =>
        fs.statSync(path.join(basePath, b)).mtimeMs -
        fs.statSync(path.join(basePath, a)).mtimeMs
    )
    .slice(0, 5); // Take 5 most recently modified files

  if (files.length === 0) {
    console.warn('⚠️ No feed files found to back up.');
    return;
  }

  const timestamp = new Date().toISOString();

  console.log(`📦 Backing up ${files.length} feed(s) to S3 bucket: ${BUCKET}`);

  for (const file of files) {
    const filePath = path.join(basePath, file);
    const fileStream = fs.createReadStream(filePath);
    const s3Key = `backups/${timestamp}-${file}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: s3Key,
      Body: fileStream,
    });

    try {
      await s3.send(command);
      console.log(`✅ Uploaded: ${file} → ${s3Key}`);
    } catch (err) {
      console.error(`❌ Failed to upload ${file}:`, err.message || err);
    }
  }
}

// Run if called directly
if (require.main === module) {
  backupFeedsToS3();
}
