// pgnfw-add.js
console.log("[pgnfw-add] script started");

const BASE_URL = "https://console.po0.io/modules/servers/penguin/api/firewall.php";

function getArgument() {
  if (typeof $argument === "string" && $argument.trim()) {
    return $argument.trim();
  }

  // 如果是通过 iOS Shortcuts 手动触发，也可以从这里取参数
  if (typeof $intent !== "undefined" && $intent.parameter) {
    return String($intent.parameter).trim();
  }

  return "";
}

const TOKENS = getArgument()
  .split(",")
  .map((t) => t.trim())
  .filter((t) => t.length > 0);

if (TOKENS.length === 0) {
  console.log("[pgnfw-add] missing argument");
  $done();
} else {
  console.log("[pgnfw-add] total tokens: " + TOKENS.length);

  // 串行依次请求，前一个完成后再发下一个
  function run(index) {
    if (index >= TOKENS.length) {
      console.log("[pgnfw-add] all done");
      $done();
      return;
    }

    const token = TOKENS[index];
    const url = BASE_URL + "?action=add&token=" + encodeURIComponent(token);

    console.log("[pgnfw-add] [" + (index + 1) + "/" + TOKENS.length + "] requesting...");

    $httpClient.get(
      { url: url, timeout: 10 },
      function (error, response, data) {
        if (error) {
          console.log("[pgnfw-add] [" + (index + 1) + "] failed: " + error);
        } else {
          console.log("[pgnfw-add] [" + (index + 1) + "] status: " + response.status);
          if (data) console.log("[pgnfw-add] [" + (index + 1) + "] body: " + data);
        }
        run(index + 1); // 继续下一个 token
      }
    );
  }

  run(0);
}
