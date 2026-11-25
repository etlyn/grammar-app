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
  const useTab = (name) => page.getByRole("tab", { name, exact: true }).click();
  const goBack = async () => {
    const button = page.getByRole("button", {
      name: "Close practice",
      exact: true,
    });
    if (await button.isVisible()) await button.click();
    else await page.getByRole("button", { name: "Back", exact: true }).click();
  };
  const openPractice = () =>
    page.locator(".rb-reader-practice-bar button").click();
  const startPractice = () =>
    page.getByRole("button", { name: "Start 20-question practice" }).click();
  const catalog = JSON.parse(
    fs.readFileSync(
      path.resolve(__dirname, "../src/generated/catalog.json"),
      "utf8",
    ),
  );
  const spanish = JSON.parse(
    fs.readFileSync(
      path.resolve(__dirname, "../src/generated/catalog-es.json"),
      "utf8",
    ),
  );
  const key = "grammacho-web-progress:" + catalog.progressVersion;
  const spanishKey = "grammacho-web-progress:" + spanish.progressVersion;
  const saved = (storageKey) =>
    page.evaluate(
      (storageKey) => JSON.parse(localStorage.getItem(storageKey)),
      storageKey,
    );
  await page.goto(previewUrl);
  await expect(
    page.getByRole("heading", { name: /Grammar,.*con gusto/ }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: /Grammar,.*con gusto/ }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Get started" }).click();
  await expect(
    page.getByRole("radio", { name: "Español", exact: true }),
  ).toBeChecked();
  await page.getByRole("radio", { name: "English", exact: true }).check();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Where do you want to start?" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Start learning" }).click();
  await expect(
    page.getByRole("heading", { name: "Learn", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("tab", { name: "Learn" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await page.screenshot({ path: desktopImage, fullPage: true });
  await page
    .getByRole("tab", { name: "Learn", exact: true })
    .press("ArrowRight");
  await expect(
    page.getByRole("tab", { name: "Map", exact: true }),
  ).toBeFocused();
  await expect(
    page.getByRole("heading", { name: "Grammar map", exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Skip to content" }).press("Enter");
  await expect(page.getByRole("tabpanel", { name: "Map" })).toBeFocused();
  await expect(page.locator(".rb-learning-area-tile")).toHaveCount(20);
  const mapSearch = page.getByRole("searchbox", {
    name: "Find a grammar concept",
  });
  await mapSearch.fill("Negation");
  const concept = page.locator(".rb-learning-map-results button").first();
  await expect(concept).toBeVisible();
  await concept.click();
  await expect(page.locator(".rb-reader")).toBeVisible();
  await page.getByRole("button", { name: "In this chapter" }).click();
  const workedLink = page.getByRole("link", { name: "Worked examples" });
  await expect(workedLink).toBeVisible();
  await workedLink.press("Enter");
  await expect(page.locator("#worked-examples")).toBeFocused();
  await expect(page.locator(".rb-reader")).toBeVisible();
  await goBack();
  await expect(
    page.getByRole("heading", { name: "Grammar map", exact: true }),
  ).toBeVisible();
  await expect(mapSearch).toHaveValue("Negation");
  await mapSearch.fill("");
  await page
    .getByRole("button", { name: "Start with the foundations" })
    .click();
  await openPractice();
  await startPractice();
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
      await page.getByRole("radio").first().focus();
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
  const score = page.getByRole("heading", {
    name: "You scored 19/20 · 95%",
    exact: true,
  });
  await expect(score).toBeVisible();
  await expect(page.locator(".review-item.needs-review")).toHaveCount(1);
  await page.getByRole("button", { name: /To review/ }).click();
  await expect(page.locator(".review-item")).toHaveCount(1);
  await page.locator(".review-item.needs-review > summary").press("Enter");
  await expect(
    page
      .locator(".review-item.needs-review")
      .getByText("How to find the answer", { exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(score).toBeVisible();
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
  await context.setOffline(true);
  await page.reload();
  await expect(score).toBeVisible();
  assert.ok(
    await page.evaluate(() =>
      document.fonts.check('600 32px "Fraunces Display"'),
    ),
  );
  await page.getByRole("button", { name: "Next chapter", exact: true }).click();
  await openPractice();
  await startPractice();
  await expect(
    page.getByRole("heading", { name: "Question 1 of 20", exact: true }),
  ).toBeVisible();
  await page.getByRole("radio").first().check();
  await page.getByRole("button", { name: "Check answer", exact: true }).click();
  await expect(page.getByText("1 answer saved", { exact: true })).toBeVisible();
  await context.setOffline(false);

  // Return through the quiz, reading and results without losing either session.
  await goBack();
  await expect(page.locator(".rb-reader")).toBeVisible();
  await goBack();
  await expect(score).toBeVisible();
  const secondState = await saved(key);
  const secondSlug = catalog.topics[1].slug;
  assert.equal(secondState.sessions[secondSlug].answers.length, 1);
  await page
    .getByRole("button", { name: "Reset chapter progress", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Keep progress", exact: true })
    .click();
  await expect(score).toBeVisible();
  await page
    .getByRole("button", { name: "Reset chapter progress", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Clear this chapter", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Start 20-question practice" }),
  ).toBeVisible();
  const afterReset = await saved(key);
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
  await startPractice();
  const radio = page.getByRole("radio").first();
  await expect(radio).toBeFocused();
  await expect(radio).toBeVisible();
  assert.ok(
    await radio.evaluate((el) => el.getBoundingClientRect().height >= 18),
  );
  await radio.check();
  await page.getByRole("button", { name: "Check answer", exact: true }).click();
  await expect(
    page.getByText("Correct answer", { exact: true }).first(),
  ).toBeVisible();
  await page.screenshot({
    path: path.join(os.tmpdir(), "grammacho-forced-colors.png"),
    fullPage: true,
  });
  await page.emulateMedia({ forcedColors: "none", reducedMotion: "reduce" });
  await goBack();
  await expect(page.locator(".rb-reader")).toBeVisible();
  await goBack();
  await expect(
    page.getByRole("heading", { name: "Grammar map", exact: true }),
  ).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });

  const courseTrigger = page.getByRole("button", {
    name: /Courses, current course/,
  });
  await courseTrigger.click();
  await page.keyboard.press("Escape");
  await expect(courseTrigger).toBeFocused();
  await courseTrigger.click();
  await page.getByRole("radio", { name: "Español", exact: true }).check();
  await page
    .getByRole("button", { name: "Switch course", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Learn", exact: true }),
  ).toBeVisible();
  await expect(page.getByText(/30 chapters · 6 stages/)).toBeVisible();
  await page.screenshot({ path: mobileImage, fullPage: true });
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  await useTab("Map");
  await expect(page.locator(".rb-learning-area-tile")).toHaveCount(10);
  await page
    .getByRole("button", { name: "Start with the foundations" })
    .click();
  await openPractice();
  await startPractice();
  await expect(
    page.getByRole("heading", { name: "Question 1 of 20" }),
  ).toBeVisible();
  await page.getByRole("radio").first().check();
  await page.getByRole("button", { name: "Check answer", exact: true }).click();
  await expect(page.getByText("1 answer saved", { exact: true })).toBeVisible();
  assert.equal(
    (await saved(spanishKey)).sessions[spanish.topics[0].slug].answers.length,
    1,
  );
  assert.equal((await saved(key)).sessions[secondSlug].answers.length, 1);
  await goBack();
  await expect(page.locator(".rb-reader")).toBeVisible();
  await goBack();
  await expect(
    page.getByRole("heading", { name: "Grammar map", exact: true }),
  ).toBeVisible();
  await useTab("Progress");
  await expect(
    page.getByRole("heading", { name: "Chapter mosaic" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Settings", exact: true }).click();
  await page.getByRole("button", { name: "Dark", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("button", { name: /Sign in/ }).click();
  await expect(
    page.getByRole("dialog", { name: "Keep learning, anywhere" }),
  ).toBeVisible();
  await expect(
    page.getByText(/Accounts are available on the public Grammacho website/),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(
    page.getByRole("heading", { name: "Settings", exact: true }),
  ).toBeVisible();
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload();
  await expect(
    page.getByRole("heading", { name: /Grammar,.*con gusto/ }),
  ).toBeVisible();
  const resetState = await saved(key);
  assert.deepEqual(resetState?.progress ?? {}, {});
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
        "onboarding",
        "course-switch",
        "map-search",
        "practice",
        "keyboard",
        "restore",
        "reset",
        "offline-reopen",
        "narrow-layout",
        "forced-colors",
        "storage-loss",
        "appearance",
        "preview-account-isolation",
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
        "Spanish-first onboarding, English keyboard practice and mistake review, independent Spanish history, offline reading/quiz, mobile reflow, theme and reset isolation",
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
