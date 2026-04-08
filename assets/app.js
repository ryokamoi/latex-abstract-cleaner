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

  document.getElementById("output").value = abstract.trim();
}

document.getElementById("addRuleButton").addEventListener("click", () => {
  addReplacementRow();
});

document.getElementById("cleanButton").addEventListener("click", () => {
  cleanUp();
});

addReplacementRow("\\alpha", "alpha");
addReplacementRow("\\beta", "beta");
addReplacementRow("\\gamma", "gamma");
