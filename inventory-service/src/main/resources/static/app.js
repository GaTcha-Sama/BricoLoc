const toolRefInput = document.getElementById("toolRef");
const resultEl = document.getElementById("result");
const btnGet = document.getElementById("btnGet");
const btnReserve = document.getElementById("btnReserve");
const statusPill = document.getElementById("statusPill");
const yearEl = document.getElementById("year");

function getRef() {
  return toolRefInput.value.trim();
}

if (yearEl) yearEl.textContent = String(new Date().getFullYear());

function setStatus(label) {
  if (!statusPill) return;
  statusPill.textContent = label;
}

function setBusy(isBusy, label) {
  btnGet.disabled = isBusy;
  btnReserve.disabled = isBusy;
  toolRefInput.disabled = isBusy;
  if (isBusy) {
    setStatus(label || "Chargement…");
  } else {
    setStatus(label || "Prêt");
  }
}

function setResult(content, statusLabel) {
  if (typeof statusLabel === "string") setStatus(statusLabel);
  resultEl.textContent = content;
}

async function getStock() {
  const ref = getRef();
  if (!ref) {
    setResult("Merci de saisir une référence outil.", "Action requise");
    return;
  }

  setBusy(true, "GET en cours…");
  const response = await fetch(`/api/stocks/${encodeURIComponent(ref)}`);
  if (response.status === 404) {
    setBusy(false, "Introuvable");
    setResult(`Aucun stock trouvé pour "${ref}".`, "404");
    return;
  }
  if (!response.ok) {
    setBusy(false, "Erreur");
    setResult(`Erreur GET (${response.status})`, "Erreur");
    return;
  }

  const data = await response.json();
  const message = [
    `Référence: ${data.toolRef}`,
    `Quantité disponible: ${data.quantity}`,
    `Identifiant: ${data.id}`
  ].join("\n");
  setBusy(false, "OK");
  setResult(message, "OK");
}

async function reserveTool() {
  const ref = getRef();
  if (!ref) {
    setResult("Merci de saisir une référence outil.", "Action requise");
    return;
  }

  setBusy(true, "POST en cours…");
  const response = await fetch(`/api/stocks/${encodeURIComponent(ref)}/reserve`, {
    method: "POST"
  });

  const body = await response.text();
  if (response.status === 404) {
    setBusy(false, "Introuvable");
    setResult(`Outil "${ref}" introuvable.`, "404");
    return;
  }
  if (response.status === 409) {
    setBusy(false, "Conflit");
    setResult(body || "Erreur : Rupture de stock !", "409");
    return;
  }
  if (!response.ok) {
    setBusy(false, "Erreur");
    setResult(`Erreur POST (${response.status})`, "Erreur");
    return;
  }

  setBusy(false, "OK");
  setResult(body || "Réservation effectuée.", "OK");
}

btnGet.addEventListener("click", () => {
  getStock().catch((error) => {
    setBusy(false, "Erreur réseau");
    setResult(`Erreur réseau GET: ${error.message}`, "Erreur réseau");
  });
});

btnReserve.addEventListener("click", () => {
  reserveTool().catch((error) => {
    setBusy(false, "Erreur réseau");
    setResult(`Erreur réseau POST: ${error.message}`, "Erreur réseau");
  });
});

// Chips de références rapides
document.querySelectorAll("[data-ref]").forEach((el) => {
  el.addEventListener("click", () => {
    toolRefInput.value = el.getAttribute("data-ref") || "";
    toolRefInput.focus();
  });
});

// Raccourcis clavier
toolRefInput.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;
  if (e.ctrlKey || e.metaKey) {
    btnReserve.click();
  } else {
    btnGet.click();
  }
});
