import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;

// Serve static files from the 'dist' directory (output of `npm run build`)
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback: handle all other routes by serving the index.html.
// This allows client-side routing to work correctly.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Production server running on http://localhost:${port}`);
});
