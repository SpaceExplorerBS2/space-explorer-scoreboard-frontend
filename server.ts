import { serve } from "bun";
import { statSync } from "fs";
import { join } from "path";

const port = process.env.PORT || 3000;
const publicDir = "./dist";

serve({
  port,
  fetch(req) {
    const url = new URL(req.url);
    let filepath = join(publicDir, url.pathname);

    // Default to index.html
    if (url.pathname === "/") {
      filepath = join(publicDir, "index.html");
    }

    try {
      // Check if file exists
      const stat = statSync(filepath);
      
      if (stat.isFile()) {
        const file = Bun.file(filepath);
        return new Response(file);
      }
    } catch {
      // If file not found, serve index.html for SPA routing
      const file = Bun.file(join(publicDir, "index.html"));
      return new Response(file);
    }
  },
})

console.log(`🚀 Server running at http://localhost:${port}`); 