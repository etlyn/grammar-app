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
    .getByRole("tab", { name: "Read", exact: true })
    .press("ArrowRight");
  await page.getByRole("tab", { name: "Practice", exact: true }).press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
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
    // Start/Next focuses the first native radio. Arrow keys may change the
    // selection, but they must never save an answer until Enter checks it.
    assert.equal(
      await page.evaluate(() => document.activeElement.type),
      "radio",
    );
    const correctIndex = q.choices.findIndex((c) => c.id === q.answerId);
    await page.keyboard.press("Space");
    for (let move = 0; move < correctIndex; move++)
      await page.keyboard.press("ArrowDown");
    assert.equal(
      await page
        .getByRole("radio", { name: correct.text, exact: true })
        .isChecked(),
      true,
    );
    await page
      .getByText(`${i} ${i === 1 ? "answer" : "answers"} saved`, {
        exact: true,
      })
      .waitFor();
    await page.keyboard.press("Enter");
    assert.match(
      await page.evaluate(() => document.activeElement.textContent),
      /Next question|Finish session/,
    );
    if (i === 0) {
      await page.reload();
      await page.getByText("1 answer saved", { exact: true }).waitFor();
    }
    await page
      .getByRole("button", {
        name: i === 19 ? "Finish session" : "Next question",
        exact: true,
      })
      .press("Enter");
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
  await page
    .getByRole("button", { name: "Next topic", exact: true })
    .press("Enter");
  await page
    .getByRole("tab", { name: "Read", exact: true })
    .press("ArrowRight");
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
  await page
    .getByRole("button", { name: "Topics", exact: true })
    .press("Enter");
  await page.keyboard.press("Escape");
  assert.equal(
    await page.evaluate(() => document.activeElement.textContent),
    "Topics",
  );
  await page.keyboard.press("Enter");
  await page.getByRole("searchbox").filter({ visible: true }).fill("articles");
  await page
    .getByRole("button", { name: /Articles: a, an and the/ })
    .filter({ visible: true })
    .click();
  await page
    .getByRole("tab", { name: "Read", exact: true })
    .press("ArrowRight");
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
        "20 keyboard answers with explicit check and focus assertions, reload resume, completion persistence, offline new session, mobile topic search and Escape focus restoration",
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
