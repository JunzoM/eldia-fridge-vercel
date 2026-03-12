module.exports = (req, res) => {
  res.setHeader("Content-Type", "application/javascript");
  res.setHeader("Cache-Control", "no-store");
  res.send(
    `window.__SB_URL__ = "${process.env.SUPABASE_URL || ""}";` +
    `window.__SB_KEY__ = "${process.env.SUPABASE_ANON_KEY || ""}";`
  );
};
