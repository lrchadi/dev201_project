// Mobile Navigation Toggle
const mobileBtn = document.getElementById("mobile-menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
const mobileLinks = document.querySelectorAll(".mobile-link");

mobileBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

mobileLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.add("hidden");
  });
});

function toggleRackPort(bayId) {
  const statusMsg = document.getElementById("rack-status-msg");
  const portContainer = document.getElementById(`rack-ports-${bayId}`);

  if (bayId === 1) {
    statusMsg.textContent =
      "Diagnostic Optique OM4: Atténuation 0.08dB (Excellent)";
    statusMsg.className = "text-brand-accent font-mono animate-pulse";
  } else if (bayId === 2) {
    statusMsg.textContent =
      "Test Cat8 Cuivre: PoE++ 88W Injecté sans Surchauffe";
    statusMsg.className = "text-green-400 font-mono animate-pulse";
  } else if (bayId === 3) {
    statusMsg.textContent =
      "Liaison Backbone OS2 DataCenter: 400Gbps Opérationnel";
    statusMsg.className = "text-brand-amber font-mono animate-pulse";
  }
}

const mediumSelect = document.getElementById("sim-medium");
const distSlider = document.getElementById("sim-distance");
const loadSlider = document.getElementById("sim-load");
const distVal = document.getElementById("distance-val");
const loadVal = document.getElementById("load-val");
const latencyElem = document.getElementById("metric-latency");
const throughputElem = document.getElementById("metric-throughput");
const statusTag = document.getElementById("cable-status-tag");
const packet1 = document
  .getElementById("packet-1")
  .querySelector("animateMotion");
const packet2 = document
  .getElementById("packet-2")
  .querySelector("animateMotion");

function updateSimulation() {
  const medium = mediumSelect.value;
  const dist = parseInt(distSlider.value);
  const load = parseInt(loadSlider.value);

  distVal.textContent = `${dist} mètres`;
  loadVal.textContent = `${load} %`;

  let baseLatency = 0.5; // ms
  let maxThroughput = 10; // Gbps
  let statusText = "Signal Lumineux Stable";
  let statusClass =
    "text-xs font-mono text-brand-accent px-2 py-1 rounded bg-brand-accent/10 border border-brand-accent/30";

  if (medium === "cat6") {
    baseLatency = 1.2 + dist * 0.015;
    maxThroughput = dist > 55 ? 0.8 : 1.0;
    if (dist > 90) {
      statusText = "Avertissement: Atténuation Élevée Cuivre (>90m)";
      statusClass =
        "text-xs font-mono text-amber-400 px-2 py-1 rounded bg-amber-500/10 border border-amber-500/30";
    }
  } else if (medium === "cat6a") {
    baseLatency = 0.9 + dist * 0.008;
    maxThroughput = dist > 100 ? 5.0 : 10.0;
  } else if (medium === "om4") {
    baseLatency = 0.3 + dist * 0.002;
    maxThroughput = 40.0;
  } else if (medium === "os2") {
    baseLatency = 0.1 + dist * 0.0005;
    maxThroughput = 100.0;
    statusText = "Liaison Fibre Laser Monomode Optimale";
  }

  // Factor in Load
  const realThroughput = (maxThroughput * (1 - load * 0.002)).toFixed(1);
  const realLatency = (baseLatency * (1 + load * 0.005)).toFixed(2);

  latencyElem.textContent = `${realLatency} ms`;
  throughputElem.textContent = `${realThroughput} Gbps`;
  statusTag.textContent = statusText;
  statusTag.className = statusClass;

  // Adjust Animation Speed based on throughput
  const speedSec = Math.max(0.6, 3.0 - realThroughput / 30).toFixed(1);
  if (packet1) packet1.setAttribute("dur", `${speedSec}s`);
  if (packet2) packet2.setAttribute("dur", `${(speedSec * 0.75).toFixed(1)}s`);
}

distSlider.addEventListener("input", updateSimulation);
loadSlider.addEventListener("input", updateSimulation);
mediumSelect.addEventListener("change", updateSimulation);
document
  .getElementById("btn-run-diag")
  .addEventListener("click", updateSimulation);

function highlightNode(nodeName) {
  alert(
    `Nœud ${nodeName} sélectionné. Toutes les paires de câblage sont testées conformes TIA-568-C.2.`,
  );
}

const portsInput = document.getElementById("cfg-ports");
const lenInput = document.getElementById("cfg-len");
const portsVal = document.getElementById("cfg-ports-val");
const lenVal = document.getElementById("cfg-len-val");
const speedSelect = document.getElementById("cfg-speed");

const resTitle = document.getElementById("cfg-res-title");
const resDesc = document.getElementById("cfg-res-desc");
const resMeter = document.getElementById("cfg-res-meter");
const resDays = document.getElementById("cfg-res-days");

function updateConfigurator() {
  const ports = parseInt(portsInput.value);
  const len = parseInt(lenInput.value);
  const speed = speedSelect.value;

  portsVal.textContent = `${ports} Prises/Ports`;
  lenVal.textContent = `${len} mètres`;

  const totalMeter = (ports * len * 1.15).toLocaleString("fr-FR"); // 15% margin
  resMeter.textContent = `${totalMeter}m`;

  let days = "2 à 3 jours";
  if (ports > 200) days = "5 à 8 jours";
  if (ports > 400) days = "10 à 15 jours";
  resDays.textContent = days;

  if (speed === "1G") {
    resTitle.textContent = "Solution Cuivre Catégorie 6 UTP / F/UTP";
    resDesc.textContent =
      "Solution économique recommandée pour les postes de travail de bureau standards.";
  } else if (speed === "10G") {
    resTitle.textContent = "Solution Catégorie 6A S/FTP ou Fibre OM4";
    resDesc.textContent =
      "Recommandé pour les environnements tertiaires modernes, Wi-Fi 6E et serveurs de proximité.";
  } else if (speed === "40G") {
    resTitle.textContent = "Solution Fibre Optique OM4 / OM5 Multimode MTP";
    resDesc.textContent =
      "Idéal pour l'interconnexion de baies serveurs et Virtualisation haute densité.";
  } else if (speed === "100G") {
    resTitle.textContent = "Backbone Fibre Optique Monomode OS2 9/125µm";
    resDesc.textContent =
      "Liaison ultra haut débit zéro perte pour Data Center et liaisons inter-bâtiments longue distance.";
  }
}

portsInput.addEventListener("input", updateConfigurator);
lenInput.addEventListener("input", updateConfigurator);
speedSelect.addEventListener("change", updateConfigurator);

function copyConfigToQuote() {
  const speed = speedSelect.value;
  const ports = portsInput.value;
  const len = lenInput.value;
  const text = `Besoin configuré : ${ports} prises sur ${len}m en technologie ${speed}. (${resTitle.textContent})`;

  document.getElementById("form-details").value = text;

  // Smooth scroll to form
  document.getElementById("quote").scrollIntoView({ behavior: "smooth" });
}

const hubsData = {
  casa: {
    title: "Casablanca Nearshore & Zenith Hub",
    sla: "Moins de 2 Heures",
    teams: "16 Techniciens Certifiés",
    phone: "+212 (0) 522 98 44 00",
    desc: "Notre hub principal à Casablanca supervise la logistique des câbles cuivre/fibre, les interventions d'urgence en Data Center et les déploiements dans la région du Grand Casablanca-Settat.",
    btnId: "hub-btn-casa",
  },
  tanger: {
    title: "Tanger Med & Automotive City Hub",
    sla: "Moins de 2 Heures",
    teams: "10 Techniciens Certifiés",
    phone: "+212 (0) 539 39 11 22",
    desc: "Spécialisé dans le câblage industriel armé, les réseaux résistant aux milieux salins/maritimes et la connectivité des usines automobiles dans la Zone Franche de Tanger.",
    btnId: "hub-btn-tanger",
  },
  rabat: {
    title: "Rabat Technopolis & Agdal Hub",
    sla: "Moins de 3 Heures",
    teams: "8 Techniciens Certifiés",
    phone: "+212 (0) 537 77 88 99",
    desc: "Dédié aux ministères, administrations publiques, universités et parcs technologiques de Rabat-Salé-Kénitra.",
    btnId: "hub-btn-rabat",
  },
  fez: {
    title: "Fès Shore & Meknès Industrial Hub",
    sla: "Moins de 4 Heures",
    teams: "6 Techniciens Certifiés",
    phone: "+212 (0) 535 60 22 33",
    desc: "Accompagnement de la transition numérique industrielle dans les parcs d'activités de Fès, Meknès et de la région Centre-Nord.",
    btnId: "hub-btn-fez",
  },
  kech: {
    title: "Marrakech & Agadir Souss Hub",
    sla: "Moins de 4 Heures",
    teams: "8 Techniciens Certifiés",
    phone: "+212 (0) 524 44 55 66",
    desc: "Solutions de câblage structuré pour complexes hôteliers de luxe, aéroports, stations solaires et industries agroalimentaires du Souss.",
    btnId: "hub-btn-kech",
  },
};

function selectHub(key) {
  // Reset active styles on buttons
  document.querySelectorAll(".hub-btn").forEach((btn) => {
    btn.classList.remove("border-brand-accent/50", "bg-brand-accent/10");
    btn.classList.add("border-slate-800");
  });

  const data = hubsData[key];
  const activeBtn = document.getElementById(data.btnId);
  if (activeBtn) {
    activeBtn.classList.remove("border-slate-800");
    activeBtn.classList.add("border-brand-accent/50", "bg-brand-accent/10");
  }

  document.getElementById("hub-title").textContent = data.title;
  document.getElementById("hub-sla").textContent = data.sla;
  document.getElementById("hub-teams").textContent = data.teams;
  document.getElementById("hub-phone").textContent = data.phone;
  document.getElementById("hub-desc").textContent = data.desc;
}

function toggleFaq(id) {
  const ans = document.getElementById(`faq-ans-${id}`);
  const icon = document.getElementById(`faq-icon-${id}`);

  if (ans.classList.contains("hidden")) {
    ans.classList.remove("hidden");
    icon.classList.add("rotate-45", "text-brand-amber");
  } else {
    ans.classList.add("hidden");
    icon.classList.remove("rotate-45", "text-brand-amber");
  }
}

function handleFormSubmit(e) {
  e.preventDefault();
  const status = document.getElementById("form-status");
  status.classList.remove("hidden");
  setTimeout(() => {
    document.getElementById("contact-form").reset();
  }, 1000);
}

// Initialize default configurator state on load
window.onload = function () {
  updateSimulation();
  updateConfigurator();
};
