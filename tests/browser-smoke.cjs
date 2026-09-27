const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const { expect } = require(
  (process.env.PLAYWRIGHT_MODULE || "playwright") + "/test",
);
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const previewUrl = process.env.GRAMMACHO_PREVIEW_URL || "http://127.0.0.1:4173";
const desktopImage = path.join(os.tmpdir(), "grammacho-desktop.png");
const mobileImage = path.join(os.tmpdir(), "grammacho-mobile-web.png");
const assert = require("node:assert/strict");
(async () => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.PLAYWRIGHT_CHANNEL
      ? { channel: process.env.PLAYWRIGHT_CHANNEL }
      : {}),
  });
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
    .getByRole("heading", { name: "The English grammar map", exact: true })
    .waitFor();
  assert.equal(await page.locator(".grammar-area").count(), 20);
  await page
    .getByRole("searchbox", { name: "Find a concept" })
    .fill("Negation");
  assert.ok((await page.locator(".concept-list button:visible").count()) > 0);
  await page.locator(".concept-list button:visible").first().click();
  await expect(
    page.getByRole("tab", { name: "Read", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await page.getByRole("tab", { name: "Grammar map", exact: true }).click();
  await expect(
    page.getByRole("searchbox", { name: "Find a concept" }),
  ).toHaveValue("");
  await page
    .getByRole("button", { name: /Start with the foundations/ })
    .click();
  await page
    .getByRole("tab", { name: "Read", exact: true })
    .press("ArrowRight");
  await page
    .getByRole("button", { name: "Start 20-question practice" })
    .press("Enter");
  await page
    .getByRole("heading", { name: "Question 1 of 20", exact: true })
    .waitFor();
  await page.getByRole("radio").first().waitFor();
  await page.evaluate(async () => {
    await Promise.all(
      document.getAnimations().map((a) => a.finished.catch(() => {})),
    );
  });
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
    await page
      .getByRole("heading", { name: `Question ${i + 1} of 20`, exact: true })
      .waitFor();
    await expect(page.getByRole("radio").first()).toBeFocused();
    const state = await page.evaluate(
      (key) => JSON.parse(localStorage.getItem(key)),
      key,
    );
    const topic = catalog.topics[0];
    const session = state.sessions[topic.slug];
    const q = topic.quizItems.find(
      (q) => q.id === session.itemIds[session.index],
    );
    const targetIndex =
      i === 0
        ? (q.choices.findIndex((c) => c.id === q.answerId) + 1) % 4
        : q.choices.findIndex((c) => c.id === q.answerId);
    const chosen = q.choices[targetIndex];
    // Start/Next focuses the first native radio. Arrow keys may change the
    // selection, but they must never save an answer until Enter checks it.
    assert.equal(
      await page.evaluate(() => document.activeElement.type),
      "radio",
    );
    if (i === 0) {
      await page.keyboard.press("Enter");
      await page.getByText("0 answers saved", { exact: true }).waitFor();
      await page.keyboard.press("Shift+Tab");
      assert.equal(
        await page
          .getByRole("button", { name: "Show hint", exact: true })
          .getAttribute("aria-expanded"),
        "false",
      );
      await page.keyboard.press("Tab");
      await page.keyboard.press("Shift");
      await page
        .getByRole("button", { name: "Hide hint", exact: true })
        .waitFor();
    }
    await page.keyboard.press("Space");
    for (let move = 0; move < targetIndex; move++)
      await page.keyboard.press("ArrowDown");
    await expect(
      page.getByRole("radio", { name: chosen.text, exact: true }),
    ).toBeChecked();
    await page
      .getByText(`${i} ${i === 1 ? "answer" : "answers"} saved`, {
        exact: true,
      })
      .waitFor();
    if (i === 1) {
      await page.keyboard.press("ArrowLeft");
      await page
        .getByText(
          "Reviewing a saved answer. Your current question and selection are kept.",
          { exact: true },
        )
        .waitFor();
      await page.keyboard.press("ArrowRight");
      await expect(
        page.getByRole("radio", { name: chosen.text, exact: true }),
      ).toBeChecked();
      assert.equal(
        await page.evaluate(() => document.activeElement.value),
        chosen.id,
      );
      await page.getByText("1 answer saved", { exact: true }).waitFor();
    }
    await expect(
      page.getByRole("button", { name: "Check answer", exact: true }),
    ).toBeEnabled();
    await page
      .getByRole("radio", { name: chosen.text, exact: true })
      .press(i % 2 ? "ArrowRight" : "Enter");
    await page.waitForFunction(
      () =>
        document.activeElement?.matches("button") &&
        /Next question|Finish session/.test(
          document.activeElement.textContent || "",
        ),
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
    .getByRole("heading", { name: "You scored 19/20 · 95%", exact: true })
    .waitFor();
  assert.equal(await page.locator(".review-item.needs-review").count(), 1);
  await page.locator(".review-item.needs-review > summary").press("Enter");
  await page
    .locator(".review-item.needs-review")
    .getByText("How to find the answer", { exact: true })
    .waitFor();
  await page.reload();
  await page
    .getByRole("heading", { name: "You scored 19/20 · 95%", exact: true })
    .waitFor();
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.waitForFunction(() => !!navigator.serviceWorker.controller);
  await context.setOffline(true);
  await page.reload();
  await page
    .getByRole("heading", { name: "You scored 19/20 · 95%", exact: true })
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
  // Keep genuine work in a second topic while resetting the completed first.
  await page.getByRole("radio").first().check();
  await page.getByRole("button", { name: "Check answer", exact: true }).click();
  await page.setViewportSize({ width: 1440, height: 1000 });
  const secondState = await page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)),
    key,
  );
  const secondSlug = secondState.activeSlug;
  await page
    .locator(".desktop-sidebar .topic-search")
    .fill(catalog.topics[0].title);
  await page
    .locator(".desktop-sidebar .topic-list button")
    .filter({ hasText: catalog.topics[0].title })
    .click();
  await page.getByRole("tab", { name: "Practice", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "You scored 19/20 · 95%", exact: true }),
  ).toBeVisible();
  const beforeReset = await page.evaluate(
    (key) => localStorage.getItem(key),
    key,
  );
  await page
    .getByRole("button", { name: "Reset topic progress", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Keep progress", exact: true })
    .click();
  assert.equal(
    await page.evaluate((key) => localStorage.getItem(key), key),
    beforeReset,
  );
  await page
    .getByRole("button", { name: "Reset topic progress", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Clear this topic", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Start 20-question practice" }),
  ).toBeVisible();
  const afterReset = await page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)),
    key,
  );
  assert.equal(afterReset.sessions[catalog.topics[0].slug], undefined);
  assert.deepEqual(
    afterReset.sessions[secondSlug],
    secondState.sessions[secondSlug],
  );
  assert.deepEqual(
    afterReset.progress[secondSlug],
    secondState.progress[secondSlug],
  );

  await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
  await page
    .getByRole("button", { name: "Start 20-question practice" })
    .click();
  const radio = page.getByRole("radio").first();
  await expect(radio).toBeVisible();
  await expect(radio).toBeFocused();
  const radioStyles = await radio.evaluate((el) => ({
    opacity: getComputedStyle(el).opacity,
    height: el.getBoundingClientRect().height,
  }));
  assert.equal(radioStyles.opacity, "1");
  assert.ok(radioStyles.height >= 18);
  await radio.check();
  await expect(radio).toBeChecked();
  await page.getByRole("button", { name: "Check answer", exact: true }).click();
  await expect(page.getByText("Correct answer", { exact: true })).toBeVisible();
  await expect(page.locator(".answer-feedback > strong")).toBeVisible();
  assert.equal(
    await page
      .locator(".answer-option")
      .first()
      .evaluate((el) => getComputedStyle(el).transitionDuration),
    "0s",
  );
  await page.screenshot({
    path: path.join(os.tmpdir(), "grammacho-forced-colors.png"),
    fullPage: true,
  });
  await page.getByRole("tab", { name: "Read", exact: true }).click();
  await expect(page.locator(".save-note")).toHaveText("Saved on this browser");
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload();
  const resetState = await page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)),
    key,
  );
  assert.deepEqual(resetState.sessions, {});
  assert.deepEqual(resetState.progress, {});
  assert.equal(errors.length, 0);
  assert.equal(remote.length, 0);
  const outcomes = {
    appId: "grammacho-web",
    build:
      process.env.GRAMMACHO_BUILD_SHA ||
      require("node:child_process")
        .execFileSync("git", ["rev-parse", "HEAD"], {
          cwd: path.resolve(__dirname, ".."),
          encoding: "utf8",
        })
        .trim(),
    executedAt: new Date().toISOString(),
    environment: previewUrl,
    device:
      "Chromium desktop 1440x1000 / mobile viewport 390x844; forced colors and reduced motion",
    results: Object.fromEntries(
      [
        "map-search",
        "practice",
        "keyboard",
        "restore",
        "reset",
        "offline-reopen",
        "narrow-layout",
        "forced-colors",
        "storage-loss",
      ].map((id) => [
        id,
        {
          status: "passed",
          note: "Executed by tests/browser-smoke.cjs; assertions passed on this build.",
        },
      ]),
    ),
  };
  for (const [id, note] of Object.entries({
    "screen-reader":
      "Requires real VoiceOver announcement acceptance by a screen-reader user.",
    "educator-review": "Requires independent qualified educator review.",
    "learner-outcome":
      "Requires approved tutor/learner pilot and observed return outcome.",
  }))
    outcomes.results[id] = { status: "blocked", note };
  if (process.env.GRAMMACHO_RESULTS_PATH)
    fs.writeFileSync(
      process.env.GRAMMACHO_RESULTS_PATH,
      JSON.stringify(outcomes, null, 2) + "\n",
    );
  console.log(
    JSON.stringify({
      journey:
        "20 keyboard answers with Shift hint, preserved Shift+Tab, Left history, Enter/Right checks, focus assertions and amber incorrect review, reload resume, completion persistence, offline new session, mobile topic search and Escape focus restoration",
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
