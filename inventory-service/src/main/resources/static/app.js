const toolRefInput = document.getElementById("toolRef");
const resultEl = document.getElementById("result");
const btnGet = document.getElementById("btnGet");
const btnReserve = document.getElementById("btnReserve");

function getRef() {
  return toolRefInput.value.trim();
}

function setResult(content) {
  resultEl.textContent = content;
}

async function getStock() {
  const ref = getRef();
  if (!ref) {
    setResult("Merci de saisir une reference outil.");
    return;
  }

  const response = await fetch(`/api/stocks/${encodeURIComponent(ref)}`);
  if (response.status === 404) {
    setResult(`Aucun stock trouve pour "${ref}".`);
    return;
  }
  if (!response.ok) {
    setResult(`Erreur GET (${response.status})`);
    return;
  }

  const data = await response.json();
  const message = [
    `Reference: ${data.toolRef}`,
    `Quantite disponible: ${data.quantity}`,
    `Identifiant: ${data.id}`
  ].join("\n");
  setResult(message);
}

async function reserveTool() {
  const ref = getRef();
  if (!ref) {
    setResult("Merci de saisir une reference outil.");
    return;
  }

  const response = await fetch(`/api/stocks/${encodeURIComponent(ref)}/reserve`, {
    method: "POST"
  });

  const body = await response.text();
  if (response.status === 404) {
    setResult(`Outil "${ref}" introuvable.`);
    return;
  }
  if (response.status === 409) {
    setResult(body || "Rupture de stock.");
    return;
  }
  if (!response.ok) {
    setResult(`Erreur POST (${response.status})`);
    return;
  }

  setResult(body || "Reservation effectuee.");
}

btnGet.addEventListener("click", () => {
  getStock().catch((error) => setResult(`Erreur reseau GET: ${error.message}`));
});

btnReserve.addEventListener("click", () => {
  reserveTool().catch((error) => setResult(`Erreur reseau POST: ${error.message}`));
});
