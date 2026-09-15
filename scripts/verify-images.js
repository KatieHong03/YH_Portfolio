import fs from 'fs';
import path from 'path';

const imagesDir = path.resolve(process.cwd(), 'public/images');
const srcDir = path.resolve(process.cwd(), 'src');

console.log('🔍 [Build Safety Check] Auditing image architecture and references...');

let hasErrors = false;

// 1. Check directory exists
if (!fs.existsSync(imagesDir)) {
  console.error('❌ Error: public/images directory does not exist!');
  process.exit(1);
}

const files = fs.readdirSync(imagesDir);
console.log(`📁 Found ${files.length} assets in public/images/`);

// 2. Check for case duplication
const lowerMap = new Map();
for (const file of files) {
  const lower = file.toLowerCase();
  if (lowerMap.has(lower)) {
    console.error(`❌ Case Collision Detected: "${file}" and "${lowerMap.get(lower)}" differ only by case!`);
    hasErrors = true;
  } else {
    lowerMap.set(lower, file);
  }

  // 3. Verify file is non-empty
  const stat = fs.statSync(path.join(imagesDir, file));
  if (stat.size === 0) {
    console.error(`❌ Zero-byte empty/corrupted file detected: public/images/${file}`);
    hasErrors = true;
  }
}

// 4. Scan source files for image references and check existence
const refRegex = /["'`]((\/images\/[a-zA-Z0-9_\-\.\/]+?\.(?:png|jpg|jpeg|svg|webp|gif)))["'`]/g;
const legacyAssetRegex = /["'`](\/assets\/[a-zA-Z0-9_\-\.\/]+?\.(?:png|jpg|jpeg|svg|webp|gif))["'`]/g;
const blobOrDataRegex = /["'`](blob:[^"'`\s]+|data:image\/[^"'`\s]+)["'`]/g;

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDir(fullPath);
    } else if (entry.isFile() && /\.(tsx?|jsx?|json)$/.test(entry.name)) {
      const content = fs.readFileSync(fullPath, 'utf8');

      // Check legacy /assets/ references
      let assetMatch;
      while ((assetMatch = legacyAssetRegex.exec(content)) !== null) {
        console.error(`❌ Legacy /assets/ path found in ${path.relative(process.cwd(), fullPath)}: ${assetMatch[1]}`);
        hasErrors = true;
      }

      // Check static files for hardcoded blob or data URLs
      if (entry.name === 'projectsData.ts' || entry.name === 'PlaygroundView.tsx') {
        let blobMatch;
        while ((blobMatch = blobOrDataRegex.exec(content)) !== null) {
          console.error(`❌ Hardcoded blob/data URL found in static source file ${entry.name}: ${blobMatch[1].slice(0, 30)}...`);
          hasErrors = true;
        }
      }

      // Check all /images/ references
      let match;
      while ((match = refRegex.exec(content)) !== null) {
        const fullRef = match[1];
        const filename = fullRef.replace('/images/', '');
        if (!fs.existsSync(path.join(imagesDir, filename))) {
          console.error(`❌ Missing image referenced in ${path.relative(process.cwd(), fullPath)}: ${fullRef}`);
          hasErrors = true;
        }
      }
    }
  }
}

scanDir(srcDir);

if (hasErrors) {
  console.error('\n🚨 Build Safety Check FAILED. Fix image issues before continuing.\n');
  process.exit(1);
} else {
  console.log('✅ [Build Safety Check] All image paths, case sensitivity, and assets verified successfully!\n');
}
