const WORKER_URL = "https://spa.misakas.org/ping";

let rawArgument = "";

if (typeof $argument !== "undefined") {
  rawArgument = $argument || "";
}

function parseArgument(arg) {
  const result = {};
  if (!arg) return result;

  arg.split("&").forEach((pair) => {
    const idx = pair.indexOf("=");
    if (idx === -1) return;

    const key = decodeURIComponent(pair.slice(0, idx));
    const value = decodeURIComponent(pair.slice(idx + 1));

    result[key] = value;
  });

  return result;
}

function getEnvironmentValue(key, fallback) {
  if (typeof $environment === "undefined") {
    return fallback;
  }

  if ($environment[key]) {
    return $environment[key];
  }

  return fallback;
}

function getDeviceId(config) {
  // 允许手动覆盖，例如 argument=device_id=iphone-main&token=xxx
  if (config.device_id) {
    return config.device_id;
  }

  const system = getEnvironmentValue("system", "surge");
  const model = getEnvironmentValue("device-model", "unknown-device");

  return `${system}-${model}`;
}

function done(message) {
  console.log(message);
  $done();
}

const config = parseArgument(rawArgument);

const SURGE_TOKEN = config.token;
const DEVICE_ID = getDeviceId(config);

if (!SURGE_TOKEN) {
  done("Missing token in script argument. Expected: argument=token=xxx or argument=device_id=xxx&token=xxx");
} else {
  $httpClient.post({
    url: WORKER_URL,
    headers: {
      "Authorization": `Bearer ${SURGE_TOKEN}`,
      "X-Device-ID": DEVICE_ID,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      source: "surge",
      device_id: DEVICE_ID,
      system: getEnvironmentValue("system", "unknown"),
      device_model: getEnvironmentValue("device-model", "unknown"),
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

    if (parsed.skipped) {
      return done(
        "IP allowlist skipped: " +
        parsed.reason +
        ", ip: " +
        parsed.ip
      );
    }

    return done("IP allowlist ping status: " + status + ", response: " + data);
  });
}
