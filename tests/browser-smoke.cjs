const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const previewUrl = process.env.GRAMMACHO_PREVIEW_URL || "http://127.0.0.1:4173";
const desktopImage = path.join(os.tmpdir(), "grammacho-desktop.png");
const mobileImage = path.join(os.tmpdir(), "grammacho-mobile-web.png");
const assert = require("node:assert/strict");
(async () => {
  const browser = await chromium.launch({ headless: true, channel: "chrome" });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  const errors = [];
  const remote = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("request", (r) => {
    if (!r.url().startsWith(previewUrl)) remote.push(r.url());
  });
  await page.goto(previewUrl);
  await page
    .getByRole("button", { name: "Start 20-question practice" })
    .click();
  await page
    .getByRole("heading", { name: "Question 1 of 20", exact: true })
    .waitFor();
  await page.screenshot({ path: desktopImage, fullPage: true });
  const key = await page.evaluate(() =>
    Object.keys(localStorage).find((k) =>
      k.startsWith("grammacho-web-progress:"),
    ),
  );
  const catalog = JSON.parse(
    fs.readFileSync(
      path.resolve(__dirname, "../src/generated/catalog.json"),
      "utf8",
    ),
  );
  for (let i = 0; i < 20; i++) {
    const state = await page.evaluate(
      (key) => JSON.parse(localStorage.getItem(key)),
      key,
    );
    const topic = catalog.topics[0];
    const session = state.sessions[topic.slug];
    const q = topic.quizItems.find(
      (q) => q.id === session.itemIds[session.index],
    );
    const correct = q.choices.find((c) => c.id === q.answerId);
    await page
      .getByRole("button", { name: q.answerId + correct.text, exact: true })
      .click();
    if (i === 0) {
      await page.reload();
      await page.getByText("1 answers saved", { exact: true }).waitFor();
    }
    await page
      .getByRole("button", {
        name: i === 19 ? "Finish session" : "Next question",
        exact: true,
      })
      .click();
  }
  await page
    .getByRole("heading", { name: "You scored 20/20 · 100%", exact: true })
    .waitFor();
  await page.reload();
  await page
    .getByRole("heading", { name: "You scored 20/20 · 100%", exact: true })
    .waitFor();
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.waitForFunction(() => !!navigator.serviceWorker.controller);
  await context.setOffline(true);
  await page.reload();
  await page
    .getByRole("heading", { name: "You scored 20/20 · 100%", exact: true })
    .waitFor();
  await page.getByRole("button", { name: "Next topic", exact: true }).click();
  await page
    .getByRole("button", { name: "Start 20-question practice" })
    .click();
  await page
    .getByRole("heading", { name: "Question 1 of 20", exact: true })
    .waitFor();
  assert.equal(remote.length, 0);
  assert.equal(errors.length, 0);
  await context.setOffline(false);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await page.getByRole("button", { name: "Topics", exact: true }).click();
  await page.getByRole("searchbox").filter({ visible: true }).fill("articles");
  await page
    .getByRole("button", { name: /Articles: a, an and the/ })
    .filter({ visible: true })
    .click();
  await page
    .getByRole("button", { name: "Start 20-question practice" })
    .click();
  await page.screenshot({ path: mobileImage, fullPage: true });
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  console.log(
    JSON.stringify({
      journey:
        "20 answers, reload resume, completion persistence, offline reload and new session, mobile topic search",
      runtimeErrors: errors,
      externalRequests: remote,
      screenshots: [desktopImage, mobileImage],
    }),
  );
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
