// pgnfw-add.js
console.log("[pgnfw-add] script started");

const BASE_URL = "https://console.po0.io/modules/servers/penguin/api/firewall.php";

function getArgument() {
  if (typeof $argument === "string" && $argument.trim()) {
    return $argument.trim();
  }
  if (typeof $intent !== "undefined" && $intent.parameter) {
    return String($intent.parameter).trim();
  }
  return "";
}

// 关键改动：改用 & 分隔（Surge 声明行是逗号分隔的 key=value，逗号会被拆坏）
const TOKENS = getArgument()
  .split("&")
  .map((t) => t.trim())
  .filter((t) => t.length > 0);

if (TOKENS.length === 0) {
  console.log("[pgnfw-add] missing argument");
  $done();
} else {
  console.log("[pgnfw-add] total tokens: " + TOKENS.length);

  function run(index) {
    if (index >= TOKENS.length) {
      console.log("[pgnfw-add] all done");
      $done();
      return;
    }
    const token = TOKENS[index];
    const url = BASE_URL + "?action=add&token=" + encodeURIComponent(token);
    console.log("[pgnfw-add] [" + (index + 1) + "/" + TOKENS.length + "] requesting " + url);

    $httpClient.get(
      { url: url, timeout: 10 },
      function (error, response, data) {
        if (error) {
          console.log("[pgnfw-add] [" + (index + 1) + "] failed: " + error);
        } else {
          console.log("[pgnfw-add] [" + (index + 1) + "] status: " + response.status);
          if (data) console.log("[pgnfw-add] [" + (index + 1) + "] body: " + data);
        }
        run(index + 1);
      }
    );
  }

  run(0);
}
