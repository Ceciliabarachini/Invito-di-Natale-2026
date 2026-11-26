const invito = window.invito;
const scena = document.getElementById("scena");
const biglietto = document.getElementById("biglietto");
const pulsante = document.getElementById("apri-busta");
const etichetta = document.getElementById("etichetta");
const titolo = document.getElementById("titolo");
const messaggio = document.getElementById("messaggio");
const dettagli = document.getElementById("dettagli");
const firma = document.getElementById("firma");

document.title = invito.titoloScheda;
etichetta.textContent = invito.scrittaBusta;
titolo.textContent = invito.titolo;

for (const testo of invito.messaggio) {
  const paragrafo = document.createElement("p");
  paragrafo.textContent = testo;
  messaggio.append(paragrafo);
}
messaggio.hidden = messaggio.childElementCount === 0;

for (const [nome, valore] of [
  ["Data", invito.data],
  ["Ora", invito.ora],
  ["Luogo", invito.luogo]
]) {
  if (!valore.trim()) continue;

  const riga = document.createElement("div");
  const campo = document.createElement("dt");
  const contenuto = document.createElement("dd");
  campo.textContent = nome;
  contenuto.textContent = valore;
  riga.append(campo, contenuto);
  dettagli.append(riga);
}
dettagli.hidden = dettagli.childElementCount === 0;
firma.textContent = invito.firma;
firma.hidden = invito.firma.trim() === "";

let ultimoCambio = 0;

pulsante.addEventListener("click", async () => {
  const apertura = pulsante.getAttribute("aria-expanded") === "false";
  const cambio = ++ultimoCambio;

  scena.classList.toggle("is-open", apertura);
  pulsante.setAttribute("aria-expanded", String(apertura));
  biglietto.inert = !apertura;
  etichetta.textContent = apertura ? "Richiudi la lettera" : invito.scrittaBusta;

  // Legge la transizione anche dopo un clic rapido o con movimento ridotto.
  const transizioni = scena.getAnimations();
  await Promise.allSettled(transizioni.map(transizione => transizione.finished));

  if (cambio !== ultimoCambio) return;
  if (apertura) {
    titolo.focus({ preventScroll: true });
    const inizioBiglietto = biglietto.getBoundingClientRect().top;
    if (inizioBiglietto < 0 || inizioBiglietto >= window.innerHeight) {
      biglietto.scrollIntoView({ block: "start" });
    }
  } else {
    pulsante.focus({ preventScroll: true });
  }
});
