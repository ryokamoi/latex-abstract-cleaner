const cleanupOptions = [
  { key: "customRules", label: "Apply custom Find -> Replace rules", enabled: true },
  { key: "emdash", label: "Convert --- to &mdash;", enabled: true },
  { key: "comments", label: "Remove LaTeX comments (from % to line end)", enabled: true },
  { key: "latexCommands", label: "Remove LaTeX commands except \\url{...}", enabled: true },
  { key: "unwrapUrl", label: "Convert \\url{text} to plain text", enabled: true },
  { key: "tildeSpace", label: "Convert ~ to normal spaces", enabled: true },
  { key: "emptyBraces", label: "Remove empty braces {}", enabled: true },
  { key: "lineBreaks", label: "Convert line breaks to spaces", enabled: true },
  { key: "doubleSpaces", label: "Collapse repeated whitespace", enabled: true },
  { key: "trim", label: "Trim leading/trailing whitespace", enabled: true }
];

function isOptionEnabled(key) {
  const option = cleanupOptions.find((item) => item.key === key);
  return option ? option.enabled : false;
}

function renderCleanupOptions() {
  const container = document.getElementById("cleanupOptionsContainer");
  container.innerHTML = "";

  cleanupOptions.forEach((option) => {
    const row = document.createElement("div");
    row.className = "option-row";
    if (!option.enabled) {
      row.classList.add("is-disabled");
    }

    const label = document.createElement("span");
    label.className = "option-label";
    label.textContent = option.label;

    const toggleButton = document.createElement("button");
    toggleButton.type = "button";
    toggleButton.className = "btn btn-toggle";
    toggleButton.textContent = option.enabled ? "Enabled" : "Disabled";
    toggleButton.setAttribute("aria-pressed", option.enabled ? "true" : "false");
    toggleButton.addEventListener("click", () => {
      option.enabled = !option.enabled;
      renderCleanupOptions();
    });

    row.appendChild(label);
    row.appendChild(toggleButton);
    container.appendChild(row);
  });
}

function addReplacementRow(from = "", to = "") {
  const container = document.getElementById("replacementsContainer");
  const row = document.createElement("div");
  row.className = "replacement-row";

  const fromInput = document.createElement("input");
  fromInput.type = "text";
  fromInput.className = "replace-from";
  fromInput.placeholder = "e.g. --";
  fromInput.value = from;

  const toInput = document.createElement("input");
  toInput.type = "text";
  toInput.className = "replace-to";
  toInput.placeholder = "e.g. -";
  toInput.value = to;

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.className = "btn btn-danger";
  removeButton.textContent = "Remove";
  removeButton.setAttribute("aria-label", "Remove replacement rule");
  removeButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    row.remove();
  });

  row.appendChild(fromInput);
  row.appendChild(toInput);
  row.appendChild(removeButton);
  container.appendChild(row);
}

function getReplacementRules() {
  const rows = document.querySelectorAll(".replacement-row");
  const rules = [];

  rows.forEach((row) => {
    const from = row.querySelector(".replace-from").value;
    const to = row.querySelector(".replace-to").value;
    if (from !== "") {
      rules.push([from, to]);
    }
  });

  return rules;
}

function cleanUp() {
  let abstract = document.getElementById("input").value;
  const outputEl = document.getElementById("output");
  const replaceList = getReplacementRules();

  if (isOptionEnabled("customRules")) {
    replaceList.forEach(([from, to]) => {
      abstract = abstract.split(from).join(to);
    });
  }

  if (isOptionEnabled("emdash")) {
    abstract = abstract.split("---").join("&mdash;");
  }

  if (isOptionEnabled("comments")) {
    abstract = abstract.replace(/%.*$/gm, "");
  }

  if (isOptionEnabled("latexCommands")) {
    abstract = abstract.replace(/\\(?!url\b)\w+\{.*?\}/g, "");
  }

  if (isOptionEnabled("unwrapUrl")) {
    abstract = abstract.replace(/\\url\{(.+?)\}/g, "$1");
  }

  if (isOptionEnabled("tildeSpace")) {
    abstract = abstract.replace(/~/g, " ");
  }

  if (isOptionEnabled("emptyBraces")) {
    abstract = abstract.replace(/\{\}/g, "");
  }

  if (isOptionEnabled("lineBreaks")) {
    abstract = abstract.replace(/\n/g, " ");
  }

  if (isOptionEnabled("doubleSpaces")) {
    abstract = abstract.replace(/\s+/g, " ");
  }

  if (isOptionEnabled("trim")) {
    abstract = abstract.trim();
  }

  outputEl.value = abstract;
  autoResizeTextarea(outputEl);
}

function autoResizeTextarea(textarea) {
  const minHeight = parseFloat(window.getComputedStyle(textarea).minHeight) || 0;
  textarea.style.height = "auto";
  textarea.style.height = `${Math.max(textarea.scrollHeight, minHeight)}px`;
}

let copyStatusTimeoutId;

function setCopyStatus(message, kind) {
  const copyStatusEl = document.getElementById("copyStatus");
  copyStatusEl.textContent = message;
  copyStatusEl.classList.remove("is-success", "is-error");
  if (kind) {
    copyStatusEl.classList.add(kind);
  }

  if (copyStatusTimeoutId) {
    clearTimeout(copyStatusTimeoutId);
  }

  copyStatusTimeoutId = setTimeout(() => {
    copyStatusEl.textContent = "";
    copyStatusEl.classList.remove("is-success", "is-error");
  }, 1800);
}

async function copyOutput() {
  const outputEl = document.getElementById("output");
  const text = outputEl.value;

  if (!text.trim()) {
    setCopyStatus("Output is empty.", "is-error");
    return;
  }

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      setCopyStatus("Copied.", "is-success");
      return;
    }

    outputEl.focus();
    outputEl.select();
    const copied = document.execCommand("copy");
    outputEl.setSelectionRange(outputEl.value.length, outputEl.value.length);

    if (copied) {
      setCopyStatus("Copied.", "is-success");
      return;
    }
  } catch (error) {
    // Fall through to final error message.
  }

  setCopyStatus("Copy failed.", "is-error");
}

document.getElementById("addRuleButton").addEventListener("click", () => {
  addReplacementRow();
});

document.getElementById("cleanButton").addEventListener("click", () => {
  cleanUp();
});

document.getElementById("copyButton").addEventListener("click", () => {
  copyOutput();
});

function setCleanupOptionsVisible(visible) {
  const panel = document.getElementById("cleanupOptionsPanel");
  const helper = document.getElementById("cleanupOptionsHelper");
  const toggleButton = document.getElementById("toggleCleanupOptionsButton");

  panel.classList.toggle("is-hidden", !visible);
  helper.classList.toggle("is-hidden", !visible);
  toggleButton.textContent = visible ? "Hide Detailed Controls" : "Show Detailed Controls";
  toggleButton.setAttribute("aria-expanded", visible ? "true" : "false");
}

document.getElementById("toggleCleanupOptionsButton").addEventListener("click", () => {
  const isOpen = !document.getElementById("cleanupOptionsPanel").classList.contains("is-hidden");
  setCleanupOptionsVisible(!isOpen);
});

["input", "output"].forEach((id) => {
  const textarea = document.getElementById(id);
  textarea.addEventListener("input", () => autoResizeTextarea(textarea));
  autoResizeTextarea(textarea);
});

renderCleanupOptions();
setCleanupOptionsVisible(false);
addReplacementRow("\\alpha", "alpha");
addReplacementRow("\\beta", "beta");
addReplacementRow("\\gamma", "gamma");
