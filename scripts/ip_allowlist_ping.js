const WORKER_URL = "https://spa.misakas.org/ping";

let rawArgument = "{}";

if (typeof $argument !== "undefined") {
  rawArgument = $argument || "{}";
}

let config = {};

try {
  config = JSON.parse(rawArgument);
} catch (e) {
  console.log("Invalid argument JSON: " + rawArgument);
  $done();
}

const SURGE_TOKEN = config.token;
const DEVICE_ID = config.device_id || "surge-device";

if (!SURGE_TOKEN) {
  console.log("Missing token in script argument");
  $done();
}

function done(message) {
  console.log(message);
  $done();
}

$httpClient.post({
  url: WORKER_URL,
  headers: {
    "Authorization": `Bearer ${SURGE_TOKEN}`,
    "X-Device-ID": DEVICE_ID,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    source: "surge",
    ts: Math.floor(Date.now() / 1000)
  }),
  timeout: 10,
  policy: "DIRECT"
}, function (err, resp, data) {
  if (err) {
    return done("IP allowlist ping failed: " + err);
  }

  const status = resp ? resp.status : "unknown";

  let parsed;
  try {
    parsed = JSON.parse(data);
  } catch (e) {
    return done("IP allowlist ping status: " + status + ", raw response: " + data);
  }

  if (parsed.ok && parsed.stored) {
    return done(
      "IP allowlist updated: " +
      parsed.ip +
      ", device: " +
      parsed.device_id +
      ", ttl: " +
      parsed.ttl
    );
  }

  return done("IP allowlist ping status: " + status + ", response: " + data);
});
