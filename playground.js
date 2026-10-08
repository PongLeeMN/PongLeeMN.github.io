(() => {
  const initialRecords = [
    { species: "Walleye", weight: 5.4, lake: "Lake Superior", id: 1 },
    { species: "Northern Pike", weight: 8.2, lake: "Fish Lake", id: 2 },
    { species: "Walleye", weight: 3.1, lake: "Lake Superior", id: 3 },
    { species: "Smallmouth Bass", weight: 2.7, lake: "Fish Lake", id: 4 }
  ];
  let records = initialRecords.map(record => ({ ...record }));
  let nextId = 5;

  const endpoint = document.getElementById("demo-endpoint");
  const idInput = document.getElementById("demo-id");
  const speciesInput = document.getElementById("demo-species");
  const lakeInput = document.getElementById("demo-lake");
  const weightInput = document.getElementById("demo-weight");
  const kInput = document.getElementById("demo-k");
  const methodOutput = document.getElementById("demo-request-method");
  const pathOutput = document.getElementById("demo-request-path");
  const requestBodyWrap = document.getElementById("demo-request-body-wrap");
  const requestBodyOutput = document.getElementById("demo-request-body");
  const responseOutput = document.getElementById("demo-response");
  const statusOutput = document.getElementById("demo-status");
  const countOutput = document.getElementById("demo-record-count");
  const fields = document.querySelectorAll("[data-demo-field]");

  const neededFields = {
    all: [], count: [], biggest: ["k"], species: ["species"],
    lake: ["lake"], search: ["species", "lake"],
    create: ["species", "weight", "lake"],
    update: ["id", "species", "weight", "lake"], delete: ["id"]
  };
  const previewPaths = {
    all: ["GET", "/fish"], count: ["GET", "/fish/count"],
    biggest: ["GET", "/fish/biggest?k=…"],
    species: ["GET", "/fish/species?species=…"],
    lake: ["GET", "/fish/lake?lake=…"],
    search: ["GET", "/fish/search?species=…&lake=…"],
    create: ["POST", "/fish"], update: ["PUT", "/fish/{id}"],
    delete: ["DELETE", "/fish/{id}"]
  };

  function updateCount() {
    countOutput.textContent = records.length + " sample record" +
      (records.length === 1 ? "" : "s") + " on this page";
  }

  function showResult(method, path, body, code, requestBody) {
    methodOutput.textContent = method;
    pathOutput.textContent = path;
    requestBodyWrap.hidden = requestBody === undefined;
    if (requestBody !== undefined) {
      requestBodyOutput.textContent = JSON.stringify(requestBody, null, 2);
    }
    responseOutput.textContent = body === undefined
      ? "(empty response body)" : JSON.stringify(body, null, 2);
    statusOutput.textContent = code + " · simulated · changes stay on this page";
    updateCount();
  }

  function validId(text) {
    const value = Number(text);
    return text.trim() !== "" && Number.isSafeInteger(value) && value > 0;
  }

  function runDemo() {
    const op = endpoint.value;
    const species = speciesInput.value.trim();
    const lake = lakeInput.value.trim();
    const idText = idInput.value.trim();
    const rawWeight = weightInput.value.trim();
    const weight = rawWeight === "" ? null : Number(rawWeight);
    const requestBody = { species, weight, lake };
    const validFields = species.length > 0 && lake.length > 0 &&
      Number.isFinite(weight) && weight > 0;
    const params = new URLSearchParams();

    if (op === "all") {
      showResult("GET", "/fish", records, "200 OK");
    } else if (op === "count") {
      showResult("GET", "/fish/count", records.length, "200 OK");
    } else if (op === "biggest") {
      const kText = kInput.value.trim();
      const k = Number(kText);
      params.set("k", kText);
      const path = "/fish/biggest?" + params.toString();
      if (kText === "" || !Number.isInteger(k) || k < -2147483648 || k > 2147483647) {
        showResult("GET", path, { error: "k must be an integer" }, "400 Bad Request");
        return;
      }
      const sorted = records.slice().sort((a, b) => b.weight - a.weight);
      showResult("GET", path, sorted.slice(0, Math.max(0, k)), "200 OK");
    } else if (op === "species") {
      params.set("species", species);
      showResult("GET", "/fish/species?" + params.toString(),
        records.filter(record => record.species.toLowerCase() === species.toLowerCase()), "200 OK");
    } else if (op === "lake") {
      params.set("lake", lake);
      showResult("GET", "/fish/lake?" + params.toString(),
        records.filter(record => record.lake.trim().toLowerCase() === lake.toLowerCase()), "200 OK");
    } else if (op === "search") {
      params.set("species", species);
      params.set("lake", lake);
      showResult("GET", "/fish/search?" + params.toString(),
        records.filter(record =>
          record.species.toLowerCase() === species.toLowerCase() &&
          record.lake.trim().toLowerCase() === lake.toLowerCase()), "200 OK");
    } else if (op === "create") {
      if (!validFields) {
        showResult("POST", "/fish",
          { error: "Species and lake are required; weight must be positive." },
          "400 Bad Request", requestBody);
        return;
      }
      const created = { species, weight, lake, id: nextId++ };
      records.push(created);
      showResult("POST", "/fish", created, "200 OK", requestBody);
    } else if (op === "update") {
      const path = "/fish/" + (idText || "{id}");
      if (!validId(idText)) {
        showResult("PUT", path, { error: "ID must be a positive integer." },
          "400 Bad Request", requestBody);
        return;
      }
      const index = records.findIndex(record => record.id === Number(idText));
      if (index === -1) {
        showResult("PUT", path, undefined, "404 Not Found", requestBody);
        return;
      }
      if (!validFields) {
        showResult("PUT", path,
          { error: "Species and lake are required; weight must be positive." },
          "400 Bad Request", requestBody);
        return;
      }
      const updated = { species, weight, lake, id: Number(idText) };
      records[index] = updated;
      showResult("PUT", path, updated, "200 OK", requestBody);
    } else if (op === "delete") {
      const path = "/fish/" + (idText || "{id}");
      if (!validId(idText)) {
        showResult("DELETE", path, { error: "ID must be a positive integer." },
          "400 Bad Request");
        return;
      }
      const index = records.findIndex(record => record.id === Number(idText));
      if (index === -1) {
        showResult("DELETE", path, undefined, "404 Not Found");
        return;
      }
      const deleted = records.splice(index, 1)[0];
      showResult("DELETE", path, deleted, "200 OK");
    }
  }

  function updateFields() {
    const visible = neededFields[endpoint.value];
    fields.forEach(field => {
      field.hidden = !visible.includes(field.dataset.demoField);
    });
  }

  function prepareEndpoint() {
    updateFields();
    const preview = previewPaths[endpoint.value];
    methodOutput.textContent = preview[0];
    pathOutput.textContent = preview[1];
    requestBodyWrap.hidden = true;
    responseOutput.textContent = "Select Run request to see a response.";
    statusOutput.textContent = "Ready · sample data stays in this page until you leave or reload";
    updateCount();
  }

  function resetDemo() {
    records = initialRecords.map(record => ({ ...record }));
    nextId = 5;
    endpoint.value = "all";
    updateFields();
    runDemo();
    statusOutput.textContent = "200 OK · sample data reset";
  }

  document.getElementById("run-api-demo").addEventListener("click", runDemo);
  document.getElementById("reset-api-demo").addEventListener("click", resetDemo);
  endpoint.addEventListener("change", prepareEndpoint);
  window.addEventListener("pageshow", event => {
    if (event.persisted) resetDemo();
  });
  updateFields();
  runDemo();
})();
