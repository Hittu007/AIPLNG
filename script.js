// --- Navigation ---
function showLandingPage() {
  document.getElementById('landing-page').style.display = 'block';
  document.getElementById('calculator-section').style.display = 'none';
  document.getElementById('sqm-calculator-section').style.display = 'none';
}
function showRollCalculator() {
  document.getElementById('landing-page').style.display = 'none';
  document.getElementById('calculator-section').style.display = 'block';
  document.getElementById('sqm-calculator-section').style.display = 'none';
}
function showSqmCalculator() {
  document.getElementById('landing-page').style.display = 'none';
  document.getElementById('calculator-section').style.display = 'none';
  document.getElementById('sqm-calculator-section').style.display = 'block';
}

// --- Element References ---
const materialType       = document.getElementById("materialType");
const coreDiameter       = document.getElementById("coreDiameter");
const coreThickness      = document.getElementById("coreThickness");
const tapeThickness      = document.getElementById("tapeThickness");
const rollDiameterSlider = document.getElementById("rollDiameterSlider");
const rollDiameterValue  = document.getElementById("rollDiameterValue");
const lengthRange        = document.getElementById("lengthRange");
const decreaseDiameter   = document.getElementById("decreaseDiameter");
const increaseDiameter   = document.getElementById("increaseDiameter");

// --- Filmic Regression Constants ---
const A = -16.03;       // intercept
const B =  0.95303;     // slope
const MAX_ERROR = 3.36; // ±m

// --- Other Tapes Correction Constants ---
const C_PAPER       = 1.052;  // least-squares multiplier
const PAPER_LOW     = 0.94;   // observed min ratio
const PAPER_HIGH    = 1.32;   // observed max ratio

// --- Compute & Display Length ---
function updateLengthRange() {
  // 1) show current roll diameter
  const D = parseFloat(rollDiameterSlider.value);
  rollDiameterValue.textContent = `${D} mm`;

  // 2) raw-length formula (unchanged)
  const coreD     = parseFloat(coreDiameter.value);
  const thickness = parseFloat(coreThickness.value);
  const tapeT     = parseFloat(tapeThickness.value) / 1000;
  const rawLength = (
    Math.PI * (Math.pow(D / 2, 2) - Math.pow((coreD + thickness) / 2, 2)))
    / (tapeT * 1000);

  // 3) branch by material type
  if (materialType.value === 'paper') {
    // Other Tapes: apply C_PAPER ± observed range
    const pred  = rawLength * C_PAPER;
    const low   = rawLength * PAPER_LOW;
    const high  = rawLength * PAPER_HIGH;
    lengthRange.textContent = `${low.toFixed(1)} m – ${high.toFixed(1)} m`;
  } else {
    // Filmic Tapes: regression ± MAX_ERROR
    const pred = A + B * rawLength;
    const low  = pred - MAX_ERROR;
    const high = pred + MAX_ERROR;
    lengthRange.textContent = `${low.toFixed(1)} m – ${high.toFixed(1)} m`;
  }
}

// --- Event Listeners ---
[
  materialType,
  coreDiameter,
  coreThickness,
  tapeThickness
].forEach(el => el.addEventListener("input", updateLengthRange));

rollDiameterSlider.addEventListener("input", updateLengthRange);
decreaseDiameter.addEventListener("click", () => {
  rollDiameterSlider.stepDown();
  updateLengthRange();
});
increaseDiameter.addEventListener("click", () => {
  rollDiameterSlider.stepUp();
  updateLengthRange();
});

// --- Initialize ---
updateLengthRange();

// --- Sq-Meter Calculator Logic (unchanged) ---
const rollWidthInput  = document.getElementById("rollWidth");
const rollLengthInput = document.getElementById("rollLength");
const sqmResult       = document.getElementById("sqmResult");

function updateSqMeter() {
  const w = parseFloat(rollWidthInput.value) || 0;
  const l = parseFloat(rollLengthInput.value) || 0;
  sqmResult.textContent = `${((w * l) / 1000).toFixed(2)} Sq-m`;
}

rollWidthInput.addEventListener("input", updateSqMeter);
rollLengthInput.addEventListener("input", updateSqMeter);
