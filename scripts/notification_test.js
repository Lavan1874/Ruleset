const URL = "https://api.day.app/66qT6qhEEdr6JwQoGQdy2W/testnote";

$httpClient.get({
  url: URL,
  timeout: 10,
  policy: "DIRECT"
}, function (err, resp, data) {
  if (err) {
    console.log("Bark test failed: " + err);
  } else {
    console.log("Bark test status: " + (resp ? resp.status : "unknown"));
    console.log("Bark response: " + data);
  }

  $done();
});
