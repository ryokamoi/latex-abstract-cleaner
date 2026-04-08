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
  replaceList.push(["---", "&mdash;"]);

  replaceList.forEach(([from, to]) => {
    abstract = abstract.split(from).join(to);
  });

  abstract = abstract.replace(/%.*$/gm, "");
  abstract = abstract.replace(/\\(?!url\b)\w+\{.*?\}/g, "");
  abstract = abstract.replace(/\\url\{(.+?)\}/g, "$1");
  abstract = abstract.replace(/~/g, " ");
  abstract = abstract.replace(/\{\}/g, "");
  abstract = abstract.replace(/\n/g, " ");
  abstract = abstract.replace(/\s+/g, " ");

  outputEl.value = abstract.trim();
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

["input", "output"].forEach((id) => {
  const textarea = document.getElementById(id);
  textarea.addEventListener("input", () => autoResizeTextarea(textarea));
  autoResizeTextarea(textarea);
});

addReplacementRow("\\alpha", "alpha");
addReplacementRow("\\beta", "beta");
addReplacementRow("\\gamma", "gamma");
