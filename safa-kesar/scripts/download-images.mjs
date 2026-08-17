// Downloads the Stitch design images (Google aida-public CDN) into public/images
// so the site doesn't depend on expiring CDN URLs. Re-run safe: skips existing files.
import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const B = "https://lh3.googleusercontent.com/aida-public/";

const IMAGES = {
  "hero-saffron.jpg": "AB6AXuBPA3n3o_Mi8NG8-3bnqjlkLlddgBbsEwITp4DpAiEngoqBUOGKSxyFruXTA5PANaWBUIHr-66Ht1SLqIsOumZuA4J8g5U5fefoEJKdoE9BFBPffj_ZKV91U7KvZjJzSa5VGF5YLaF0J7A4xlrV6y-mfHfPx1wQP_QDXvB5yfv_VhIhiWQvq4K2FdsP4FPKJBuPEn4oJKh5xyWe-ADumueFyTqAPDw7TxySGStv49hYwwj26OfAaK3V",
  "provenance-fields.jpg": "AB6AXuCwn4s55TcIqFsAUXS6BrEqa51Qqu5NzPGVseQE9KND1VHYt7ts8Y6NqGP3WnH81LhGprbqrUU9k-5ywo63YQsX-GC5Zh1ZhvUSmTecCSSAketcDAhxkae_3Fq23TpCY2g1JKGN5jSPsaqA48xw-SSzkbqPFZcyoK_GTzk979JdWDUvsqMBJ9HcvaCEPxo9gCSsdyspnHYhRc3Myz189ed4qzhGz4TV82Dt4DPVfPIChaHpApYELyP4",
  "mongra-macro.jpg": "AB6AXuBcniykqALTNIkg_Hdm4kHn2qF5AtXowRB_9AwigPengGuuhe9-CVKL4HGGJHAWKRWEUE67cAOutA6qLcIpHI2FQsESAQmsK7hbsn3MuBdip7GZlXjlx_AlIJhsuHLZVlBLcxQig9yl3QNXINfAw9F6U3roXjE4RhfwzAT-lNAYJFnwDsI3C1DuKOGrCVxq6lKi0-gPf4Q3o8-mn0wEjkPs7cGilW30NaXjed6_6N1-pGRrKb7wE1IP",
  "walnuts.jpg": "AB6AXuBzbUMsQpmvZ85BsDp4uBPI_M06Clj1I7JRDTo0IKJqwDJ-d2fIrwZb9RLBU3KcAEgsYYX3bY40uycEbKiUSlb-xKG-N1bkPnhoIfLgiNLJkchHU2-7SRuYY1Z2fODG09myytX5y_sk5xjkyByHL7Ftwx_Yovs4FlyLJLLBdEZIxgXA3-B88e0ArlDgcvLN2Jst1MKktl_Fv8PpoC_qFGEYqav2wF0nHeirM_5gZArkC76VG_ZMPp8I",
  "kahwa.jpg": "AB6AXuDHcTBBH7VMriaFKZKU_wpXiAK-wVJyFKRlzEoY2biEH89lKWAG0h7b11ablNAVGfCazwkWdPnsHtQpu3QLL2QpDAsKeKNEvY3B1-RcIGn51UDy-JS32ID07MtAbCWn_q-Ft9FoYv_wwpph11B40AuXcgqIUgDJf_40O34pbBLbgFWEdHpEh2pdtTZm3ggJ7a6a3gK3T1N9KVHkd2eYhn5m0817nae_-sWf543c9j4pJdkxey_BH-EF",
  "thread-macro.jpg": "AB6AXuClCXpds9DZecSnL1BN9XV7DQ9qJrLXIgNq0jya63GqFQyxpx0jSzi_aKUYZFieFkFKlH0fTh6fm258qW7kY9dZTcuhPsRBbeGn0FYX8obd_h92uB9KzGSKyfr5AJGyImQKUuzu1Y2v5Ta8qhHnLEMlyTzIfXH5VzfHAav_5Itr_06wjBHNXAzpvjcqtK2zeT6-s8GXjwDBzIxgG3RmtJVtZzJ1_mGo-hHrskjgZF6hcgpOPKi8fBgn",
  "brass-bowl.jpg": "AB6AXuAf3oZ9aZdmQQ2OY95_h0w5eebDtLfYmUelrDu0izLZF2W9ov3oEu_1WF2yDfxiFfH2llyzp-HYkkbnFqJiFR3ItfL3vSiHZ3bf9qO0v9psO7wt_O8OL7z7Ts8KP5cll7rEcrvbc-OPnCCnCZajK53EQMcPhOdksXMqbKHMQQW6MQq5i7uqXzyUO2LGqHeoEekPRLAfNNglowBXLFiUpfOGubKHAjw-JSpMVRtvGv11sCrsseCQCsIJ",
  "grade-comparison.jpg": "AB6AXuAaNDAnUjzoTV0Rnf7wF_rq4MVSNKu9tEU_Pxbaq7TuVC2xiISZTPSI08vswGP1hHT7Q2TXRlS45Dgk0PZkXAPLzhAjpXH7ODaJkNY6y9cvjIniJa1D8QiKv0sX_1iahidpoPctw3wljxMrugZa9on6pZmeK6DRb83V6g5jRsNrKuXSvR4ISfHqEHSM4TH4gpsoh3S7cZEzDwGYwY-73FppqHkGduFNgYLapCNqSpwFLPn7kSGhbn7w",
  "shop-saffron.jpg": "AB6AXuBj8M0kcoYw0CXpzAl6a4k_yMKnPBEVBxOpV05ZT9Y-uvu3z7NIef1ZUODTL2ZwbvtbGu_28Zg-NHGhACbXV5nhndJQN7WbqmXLdQ3R9dqlVXyqmh3z7CHwb3chKZehv2-z8RVo-7prhuCgk5PtILmCAFrMoLGlD_1YeIPUE20HCyNyL2mvAjqqkRZwpL07-HKX2xYE50klyCpttrfXaDaPFawJ5EcKLMxlz4bqawZRxmFXVBkIkM4l",
  "shop-walnuts.jpg": "AB6AXuBvp8t8rdZ-hrg07aOhxQSW0g1K5S-kf-3iuK1broDR4MxkPnMcrvEtfz5L2clOd3cq2Z9gbH514UZiWJ-HBb46bwJS9OVhsJO3pUtsx-cPlAFr6folOGJE-O21mSBikt3PoZZrT82xSTNlQ2Lk2oaiZ6Alhme_8K_5DMAVJAP6bGecZ4BM1in2lgMySuf1PxYV6JJVqlAKKdIlV5ih0npwAWFKCZ3rWhGPxv5gNfCYfcBeT3q8y8IZ",
  "mamra-almonds.jpg": "AB6AXuBuKwxnv5EBaiIa479bk3a3dt3lD3EOzluLKQNSxmAcZwR6q2IIB60GbcX9CHUiJc37sCjAXEpKEnvXCOrSYS8saLfQlP348neZV2R1x_SbiaMppHEsVgV9fa3R5RYmZahrIH6VMwiYWXi91M885hlnEXUKmUV_N-4HO_H0911d8nIz3UfqX1EFkzrquQ8Gg4z7Kat3HWQEVeqVhlPk23tz3Xlo9NfBmId4lfR7aYyt5Ur1NSHsQsB8",
  "pecans.jpg": "AB6AXuASt9s-OYGw8jwFMTqnVr5DASoMW_wsqrGTMhJzYbOtCrajgnmUbuFMjeeyAj8ykOx482X8BT9nWWi6kiGYTKXhkjuVadB4qNLHA_8iUEaRxN0jrAj2bIU9rc31X7fjIOqUKcNc7fJcP4v3Q0U13g3Dc6ZnO1-KO1tmYhcg9Gb4am7dFEcWY7P6USFajCVGP1LFrzGJFcr-F_H10373dpj52oyqO8-UYHascBiz26ehqSD9Jj_BgoLr",
  "rose-water.jpg": "AB6AXuC6mVG1t5WFvhexiImpjCKZNvIKytuxaAO0ux24vmG9MoKL7s2hsFjsLRcabDfgZc5a2QYc8JfyP34HnXDitTyePiQR-AzO-0UUzAx94355Y2iBz20eSHU8ijC5P-UXN0HU9ZkiZYYsZBdmd7A0eCFhVg1ijOEXAcJN_A5tC0eIFDzI3VL3DjVHBEc-oLqU9dHJmuMsYsEuVknpCGnOp4VDrUkeXrFHVxSZbPkP_NzSvE1NYAhA_u5b",
  "shilajit.jpg": "AB6AXuDBl-JIVX4EeZo1JJWRex0m0ED80Rko9DT-7mhgcOnnLITQ1M0X7ofqRs5Ry24BxvKba8umMUEgE2D546wv6qZrmI4v2FvrGcZ25MuMFYXziA7MMEl5hVZfOhXM354P5J5XNslG_clJi09pScH03DZIuV5BMV4RsZGdufvPWNpecdCFuKeFQpmqiawsdjXi-rEa_g1RlXN1YQB-KCXYrzjl6Hpxo4UIRFaZIZOn5DmL94M7COyObitc",
  "pdp-main.jpg": "AB6AXuCSLx8CLyOQ07ir3R0Isrwf3plaCO99cKoepB_91V5xq0d9W16ZMCei6H3P9S8mPCM1Zhx0-SMeM6F-zQcMsSBim0e9T_GOlWKqfFJ8xGFmOdYm4u1u2KlFYkOJoZ8YnASi8pV40FKGmZaAVAjgPKmm0j1sLfdEOqfCf_MMU5CqgiAwboPZDAxejqDrFFkeEkDlTQInoRDmO5DuiuyM9mnUCASPetKuhOPA6Ei4Ua023XkiT-Czcj53",
  "pdp-jar.jpg": "AB6AXuCjf1i6nGXuy5fhOh0xgbp78qn5eHAnb-F66Pk1XoCtXG4JAUw8c4U76oOlkN6u761A8Aw9g07aBre2V3Ai-9s1ElTc3zLecPbc_KuZJoKzllDcAVAdCP92AJlNj2UpiLs8TJFwjryzm1b4TIcl7lvyn7hdiB5rvXTWqkkCnTPKOfCdRTFe_J9UbJ2We_ZakdaCzOKV9NmIj-gNHBD6OTGcCYD4auGbJj5YxjpVIiTdfOaKQlzHCPu9",
  "pdp-tweezers.jpg": "AB6AXuAUAwHv-MoOOyaIxBzxB5I56Fo77TjdxqoanPIt6j-lVLsXzVP4-7xn8RE2-_YjqUlvkcOdtjjcatMQXZobRt9pvjQYmCIk9q4gmKKGJ-4ghTipA3U_e3TkaCAKYKT_cYVrMnD6HACaNbLdJJBpU6SbJyPOL1PGDqFvEjBJsvTXxHO1ivYpjZ40n_EZ1Krmt-csdbWouqP4SElLd681mCOqGUFcG5THmMp79K3cm3qxSDxPgFg_nRIM",
  "cart-saffron.jpg": "AB6AXuBmCNcidz2HE0H3eruoVO91LIDmHSCRo3ZOEW2apV2T8-qqvXLer5LDEFC0k7FnrTSHDgp7jib0hms4PNuThiC3yGCKZQQdoVML9sVO5OqlkInKa7PenSNiGYj5V1Z-RxsUWfHK_BF_pKi1VKlHrWu6SzAyl0OD0CsJnuD_XDdP74uPYq-w0RVqwNQkt6XXoYGexRYllUlxxieudTeGdeliWZ_P8pAKM1zbGrIQELo1HynYlRyq0Zm_",
  "cart-jar.jpg": "AB6AXuCmITC78ioeRfzBJayrtGyY0A3EL4jqNJUYw782cdVEvYIIR5N5JJgQmaJReI_uKBhKHARN0-dxWg4tUbp1QTyw-r_NblYoYLh2_-rJpmMB194hj71nrmifyZUnSFy1ZqeW6idOItHaghgeSWgim6TDb_L37Puik5S7MpqdHItE7sB_-m8SvY9rtEF4_p3agZ3wy_lWY80be2BmFpaRKPzKr7-RoNtps08nl3ezok5Il_uclkCaROxh",
  "cart-almonds.jpg": "AB6AXuB1TXCBQWXXkqCLNIC0qiJgVbxUgp_qUKTNJf-VHU9sdUXt0h5FAAgy6cu1C_SljI4aJmXb8KCc_iV6rMoCxsKBEMG-dHFoRRcifyoxbV_bmJCIWZwkItsrnCQJe6Rjq2gmcVyb2LlevJbhvktrI6Hr3bip3N3RDJprfUxHO3JVEfMfsPgrR6rB5r_iE9i8TScCVBLiRN1sVS_2vl-c5eiRKwa8x060B-nJoqKnMUe-JZbusQDlEFs1",
  "storefront.jpg": "AB6AXuABorqLW2ZuzsBg24TvaA823_dhQ8jYooRwOb6YmCE0jheJyVxs4ECZG_hyCl2CWTFsUE1T--2LOM4uZKhWyaFWn5-8C0fqEOMt_BhuSUdKd4jp4dtc19w0UBO8yhU1F3k0hiodn_VVoyJ6ETNW5kws0MV98F6nwBQR74ZkDgG3jl_BWcUKj5FwQ0yQKNAZQHn2SIgR5m5YXdT6rmJW_CfVm7TErhfXvnI-VzgpWYtPh3T8T9HaQMb9",
  "map.jpg": "AB6AXuDIHi5g_RCBS-5yPC2zNozR3hW3nAv66r-OMMtUNrwBKaczGueC0XHFKzaHMJoEee1oZVRzAMSA8dcQL2Cdqyln7Wq8eaniqC3w6-sHHQ4v1Q2kZrfWA3FmetqOE_oHgXb6tvRjtxBkoAksCx8nDNhTt8l70bGlKU7Vz-NBRcxfMc0i4gJ022Nm75vctxUhAZC7AbX94PfRTAfw6LEKUAqdjThrLN8YGUN6OpDDeQ5g2qUs1kxKRWyr",
  "store-jar.jpg": "AB6AXuAqlbPIBpwpHcWgC-bTX8g0Dgf6AqWl2ghKQ5711Ty_LfILB4Aa73nqamnDLh7op9uVHr1PQSBY6lTPWrvLL1MEkiw-frpswvjLzszAMCJ_eSq0LSkW3gu1GWN3_B8vxZFMHagq0NVz1dKOA18HO1OKB8LSla7654AOkc-R4JAqlEK35d72-94lVNZqfrIPqRMmgR0duJqx2z93SojvORPUQylq1H2n2x1gLBcXBGHavmLCGdBksub",
  "store-interior.jpg": "AB6AXuBLm271lTxncDuoaPtWFeaV7y8J6jhF9ixzOx8oHffpXmSUNh6iiYyQmP493PBMJaW7Q8BNbsfAXdeF3TBt3_YkXMbptNnsnhyOuo5fMdDd7IfzIgs1QDALEej35irO8T6G0itr0FKEnm9fFCiB0MMhl2QzyMTmHxQCJWbzp6No9HEI3VVg9CfSOTctEqkGVSuOQydDih0VPiZ6tqaPVpQiAwJHtNp5YyBgIZk4Pj_xzyIy018D1rbz",
};

const outDir = path.join(process.cwd(), "public", "images");
await mkdir(outDir, { recursive: true });

let ok = 0, fail = [];
for (const [name, id] of Object.entries(IMAGES)) {
  const dest = path.join(outDir, name);
  if (existsSync(dest) && (await stat(dest)).size > 1000) { ok++; continue; }
  try {
    const res = await fetch(B + id, { signal: AbortSignal.timeout(30000) });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 1000) throw new Error("too small: " + buf.length);
    await writeFile(dest, buf);
    console.log("OK  " + name + " (" + Math.round(buf.length / 1024) + " KB)");
    ok++;
  } catch (e) {
    console.error("FAIL " + name + ": " + e.message);
    fail.push(name);
  }
}
console.log(`\n${ok}/${Object.keys(IMAGES).length} downloaded` + (fail.length ? ", FAILED: " + fail.join(", ") : ""));
if (fail.length) process.exit(1);

import { stat } from "node:fs/promises";
