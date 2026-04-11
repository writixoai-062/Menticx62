import app from "./app";
import { logger } from "./lib/logger";

// Export app as default for Vercel serverless deployment
export default app;

// Only bind to a port when running locally (PORT is set by the dev environment)
const rawPort = process.env["PORT"];

if (rawPort) {
  const port = Number(rawPort);

  if (Number.isNaN(port) || port <= 0) {
    throw new Error(`Invalid PORT value: "${rawPort}"`);
  }

  app.listen(port, (err) => {
    if (err) {
      logger.error({ err }, "Error listening on port");
      process.exit(1);
    }

    logger.info({ port }, "Server listening");
  });
}
