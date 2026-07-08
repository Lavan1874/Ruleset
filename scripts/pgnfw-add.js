// pgnfw-add.js
console.log("[pgnfw-add] script started");
console.log("[pgnfw-add] script type: " + (typeof $script !== "undefined" ? $script.type : "unknown"));
console.log("[pgnfw-add] script name: " + (typeof $script !== "undefined" ? $script.name : "unknown"));
const BASE_URL = "https://124.221.69.228/api/firewall/";

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

const TOKEN = getArgument();

if (!TOKEN) {
  console.log("[pgnfw-add] missing argument");
  $done();
} else {
  const URL = BASE_URL + TOKEN + "/add";

  $httpClient.get(
    {
      url: URL,
      timeout: 10,

      // 如果证书校验失败，再取消注释：
      // insecure: true,
    },
    function (error, response, data) {
      if (error) {
        console.log("[pgnfw-add] failed: " + error);
      } else {
        console.log("[pgnfw-add] status: " + response.status);
        if (data) console.log("[pgnfw-add] body: " + data);
      }

      $done();
    }
  );
}
