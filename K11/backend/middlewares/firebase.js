import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { readFileSync } from 'fs';
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Get the directory name using ES module meta
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read and parse the service account file
const serviceAccount = JSON.parse(
  readFileSync(new URL('./K11ServiceAccountKey.json', import.meta.url))
);

// Initialize Firebase Admin
const app = initializeApp({
  credential: cert(serviceAccount)
});

// Get Auth instance
const auth = getAuth(app);

export { auth };