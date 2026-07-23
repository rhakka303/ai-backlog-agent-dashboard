import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("selector and search containers restore the shared outer keyboard focus ring", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  const override =
    ".select-control:has(select:focus-visible), .backlog-search:has(input:focus-visible), .search-box:has(input:focus-visible) { outline: 3px solid rgb(22 125 120 / 28%); outline-offset: 2px; }";

  assert.ok(css.includes(".select-control select { min-width: 180px; border: 0; outline: 0;"));
  assert.ok(css.includes(".backlog-search input { width: 100%; border: 0; outline: 0;"));
  assert.ok(css.includes(".search-box input { width: 100%; border: 0; outline: 0;"));
  assert.ok(css.includes(override));
  assert.ok(!css.includes(".select-control select:focus-visible"));
  assert.ok(css.indexOf(override) > css.indexOf(".search-box input {"));
});
