let client = null;

export function sseConnect(req, res) {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  // res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  if (client) {
    try {
      client.end();
    } catch {}
  }

  client = res;

  res.write(`data: ${JSON.stringify({ type: "connected" })}\n\n`);

  req.on("close", () => {
    if (client === res) client = null;
  });
}

export function sseSend(event) {
  if (!client) return;
  client.write(`data: ${JSON.stringify(event)}\n\n`);
}
