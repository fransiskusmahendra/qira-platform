import assert from "node:assert/strict";
import test from "node:test";

import { findBusinessBlueprint } from "../src/index.ts";

test("does not classify words containing ikan as fish farming", () => {
  const context = [
    "Usaha Anda bernama QIRA E2E TEST 190826, dengan ukuran tim 1–3 orang.",
    "Kondisi awal yang disampaikan: Operasional Manual",
    "Deskripsi menunjukkan beberapa proses operasional perlu disatukan agar status, tugas, dan data tidak tersebar.",
  ].join(" ");

  assert.equal(findBusinessBlueprint(context), undefined);
});

test("matches tambak blueprint when ikan is a whole word", () => {
  assert.equal(findBusinessBlueprint("Usaha budidaya ikan lele")?.id, "tambak-budidaya");
});

test("matches a multi-word blueprint keyword", () => {
  assert.equal(findBusinessBlueprint("Kami menjalankan usaha sewa mobil harian")?.id, "rental-kendaraan");
});
