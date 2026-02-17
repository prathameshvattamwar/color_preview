/* ============================================================
   ChromaStudio — app.js
   ============================================================ */

// ── STATE ──────────────────────────────────────────────────
const state = {
  mode: 'single',         // 'single' | 'gradient'
  gradientType: 'linear', // 'linear' | 'radial'
  angle: 90,
  previewMode: 'bg',

  // single color
  singleColor: '#6366f1',
  singleOpacity: 100,

  // gradient stops
  stops: [
    { id: 'stop_1', color: '#6366f1', position: 0,   opacity: 100 },
    { id: 'stop_2', color: '#a855f7', position: 100, opacity: 100 },
  ],
  activeStopId: 'stop_1',
  stopCounter: 2,

  // computed css
  lastCss: '',
};

// ── DOM REFS ───────────────────────────────────────────────
const $ = id => document.getElementById(id);

const singleOpacitySlider  = $('single-opacity');
const singleOpacityVal     = $('single-opacity-val');
const singleColorPicker    = $('single-color-picker');
const singleSwatch         = $('single-swatch');
const singleHexInput       = $('single-hex');

const stopColorPicker      = $('stop-color-picker');
const stopSwatch           = $('stop-swatch');
const stopHexInput         = $('stop-hex');
const stopPositionSlider   = $('stop-position');
const stopPositionVal      = $('stop-pos-val');
const stopOpacitySlider    = $('stop-opacity');
const stopOpacityVal       = $('stop-opacity-val');
const activeStopIndex      = $('active-stop-index');
const removeStopBtn        = $('remove-stop-btn');

const gradientTrack        = $('gradient-track');
const angleInput           = $('angle-input');
const angleNeedle          = $('angle-needle');
const angleWheel           = $('angle-wheel');

const previewInner         = $('preview-inner');
const previewScreen        = $('preview-screen');
const infobarModeLabel     = $('infobar-mode-label');
const infobarCssPreview    = $('infobar-css-preview');
const cssOutputText        = $('css-output-text');

const fullscreenOverlay    = $('fullscreen-overlay');
const fullscreenPreview    = $('fullscreen-preview');
const fsModeLabel          = $('fs-mode-label');
const fsCssLabel           = $('fs-css-label');

// ── INIT ───────────────────────────────────────────────────
function init() {
  bindSingleColor();
  bindStopEditor();
  bindAngleWheel();
  renderGradientTrack();
  selectStop(state.activeStopId);
  applyPreview();
}

// ── MODE SWITCH ────────────────────────────────────────────
function setMode(m) {
  state.mode = m;
  $('btn-single').classList.toggle('active', m === 'single');
  $('btn-gradient').classList.toggle('active', m === 'gradient');
  $('single-section').classList.toggle('hidden', m !== 'single');
  $('gradient-section').classList.toggle('hidden', m !== 'gradient');
  applyPreview();
}

function setGradientType(t) {
  state.gradientType = t;
  $('btn-linear').classList.toggle('active', t === 'linear');
  $('btn-radial').classList.toggle('active', t === 'radial');
  $('angle-block').classList.toggle('hidden', t !== 'linear');
  applyPreview();
}

function setPreviewMode(el, m) {
  state.previewMode = m;
  document.querySelectorAll('.mode-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  const labels = {
    bg: '<i class="fa-solid fa-fill-drip"></i> Background Mode',
    'button-bg': '<i class="fa-solid fa-computer-mouse"></i> Button Background',
    text: '<i class="fa-solid fa-font"></i> Text Color Mode',
    border: '<i class="fa-regular fa-square"></i> Border Mode',
    card: '<i class="fa-solid fa-layer-group"></i> Card Mode',
  };
  infobarModeLabel.innerHTML = labels[m] || m;
  if ($('fs-mode-label')) $('fs-mode-label').innerHTML = labels[m] || m;
  applyPreview();
}

// ── SINGLE COLOR ───────────────────────────────────────────
function bindSingleColor() {
  singleColorPicker.addEventListener('input', () => {
    state.singleColor = singleColorPicker.value;
    singleSwatch.style.background = state.singleColor;
    singleHexInput.value = state.singleColor.replace('#', '').toUpperCase();
    applyPreview();
  });

  singleHexInput.addEventListener('input', () => {
    const raw = singleHexInput.value.trim();
    if (/^[0-9a-fA-F]{6}$/.test(raw)) {
      state.singleColor = '#' + raw;
      singleSwatch.style.background = state.singleColor;
      singleColorPicker.value = state.singleColor;
      applyPreview();
    }
  });

  singleOpacitySlider.addEventListener('input', () => {
    state.singleOpacity = parseInt(singleOpacitySlider.value);
    singleOpacityVal.textContent = state.singleOpacity + '%';
    applyPreview();
  });
}

// ── STOP EDITOR ────────────────────────────────────────────
function bindStopEditor() {
  stopColorPicker.addEventListener('input', () => {
    const stop = getActiveStop();
    if (!stop) return;
    stop.color = stopColorPicker.value;
    stopSwatch.style.background = stop.color;
    stopHexInput.value = stop.color.replace('#', '').toUpperCase();
    renderGradientTrack();
    applyPreview();
  });

  stopHexInput.addEventListener('input', () => {
    const raw = stopHexInput.value.trim();
    if (/^[0-9a-fA-F]{6}$/.test(raw)) {
      const stop = getActiveStop();
      if (!stop) return;
      stop.color = '#' + raw;
      stopSwatch.style.background = stop.color;
      stopColorPicker.value = stop.color;
      renderGradientTrack();
      applyPreview();
    }
  });

  stopPositionSlider.addEventListener('input', () => {
    const stop = getActiveStop();
    if (!stop) return;
    stop.position = parseInt(stopPositionSlider.value);
    stopPositionVal.textContent = stop.position + '%';
    sortStops();
    renderGradientTrack();
    applyPreview();
  });

  stopOpacitySlider.addEventListener('input', () => {
    const stop = getActiveStop();
    if (!stop) return;
    stop.opacity = parseInt(stopOpacitySlider.value);
    stopOpacityVal.textContent = stop.opacity + '%';
    applyPreview();
  });
}

function getActiveStop() {
  return state.stops.find(s => s.id === state.activeStopId);
}

function selectStop(id) {
  state.activeStopId = id;
  const stop = getActiveStop();
  if (!stop) return;

  stopSwatch.style.background = stop.color;
  stopColorPicker.value = stop.color;
  stopHexInput.value = stop.color.replace('#', '').toUpperCase();
  stopPositionSlider.value = stop.position;
  stopPositionVal.textContent = stop.position + '%';
  stopOpacitySlider.value = stop.opacity;
  stopOpacityVal.textContent = stop.opacity + '%';

  // index label
  const idx = state.stops.findIndex(s => s.id === id);
  activeStopIndex.textContent = idx + 1;

  // disable remove if only 2 stops
  removeStopBtn.disabled = state.stops.length <= 2;
  removeStopBtn.style.opacity = state.stops.length <= 2 ? '0.35' : '1';
  removeStopBtn.style.pointerEvents = state.stops.length <= 2 ? 'none' : 'auto';

  renderGradientTrack();
}

function removeActiveStop() {
  if (state.stops.length <= 2) return;
  state.stops = state.stops.filter(s => s.id !== state.activeStopId);
  state.activeStopId = state.stops[0].id;
  selectStop(state.activeStopId);
  renderGradientTrack();
  applyPreview();
}

function sortStops() {
  state.stops.sort((a, b) => a.position - b.position);
}

// ── GRADIENT TRACK ─────────────────────────────────────────
function renderGradientTrack() {
  // Update track background
  const cssGrad = buildGradientCss();
  const linearPreview = buildLinearForTrack();
  gradientTrack.style.background = linearPreview;

  // Remove old dots
  gradientTrack.querySelectorAll('.stop-dot').forEach(d => d.remove());

  // Render dots
  state.stops.forEach(stop => {
    const dot = document.createElement('div');
    dot.className = 'stop-dot' + (stop.id === state.activeStopId ? ' active' : '');
    dot.style.background = stop.color;
    dot.style.left = stop.position + '%';
    dot.dataset.id = stop.id;

    // Click to select
    dot.addEventListener('mousedown', e => {
      e.stopPropagation();
      selectStop(stop.id);
      startDotDrag(e, dot, stop);
    });

    gradientTrack.appendChild(dot);
  });
}

function buildLinearForTrack() {
  const sorted = [...state.stops].sort((a, b) => a.position - b.position);
  const parts = sorted.map(s => {
    const rgb = hexToRgb(s.color);
    const a = (s.opacity / 100).toFixed(2);
    return `rgba(${rgb.r},${rgb.g},${rgb.b},${a}) ${s.position}%`;
  });
  return `linear-gradient(to right, ${parts.join(', ')})`;
}

// ── DOT DRAG ───────────────────────────────────────────────
function startDotDrag(e, dot, stop) {
  const trackRect = gradientTrack.getBoundingClientRect();
  const onMove = (ev) => {
    const clientX = ev.touches ? ev.touches[0].clientX : ev.clientX;
    let pct = ((clientX - trackRect.left) / trackRect.width) * 100;
    pct = Math.max(0, Math.min(100, Math.round(pct)));
    stop.position = pct;
    stopPositionSlider.value = pct;
    stopPositionVal.textContent = pct + '%';
    sortStops();
    renderGradientTrack();
    applyPreview();
  };
  const onUp = () => {
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onUp);
    document.removeEventListener('touchmove', onMove);
    document.removeEventListener('touchend', onUp);
  };
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onUp);
  document.addEventListener('touchmove', onMove, { passive: true });
  document.addEventListener('touchend', onUp);
}

// Click on track to add new stop
gradientTrack.addEventListener('click', e => {
  if (e.target.classList.contains('stop-dot')) return;
  const rect = gradientTrack.getBoundingClientRect();
  let pct = ((e.clientX - rect.left) / rect.width) * 100;
  pct = Math.max(0, Math.min(100, Math.round(pct)));

  state.stopCounter++;
  const newId = 'stop_' + state.stopCounter;
  // interpolate color from neighbours
  const color = interpolateColorAtPos(pct);
  state.stops.push({ id: newId, color, position: pct, opacity: 100 });
  sortStops();
  selectStop(newId);
  renderGradientTrack();
  applyPreview();
});

function interpolateColorAtPos(pct) {
  const sorted = [...state.stops].sort((a, b) => a.position - b.position);
  let left = sorted[0];
  let right = sorted[sorted.length - 1];
  for (let i = 0; i < sorted.length - 1; i++) {
    if (sorted[i].position <= pct && sorted[i + 1].position >= pct) {
      left = sorted[i];
      right = sorted[i + 1];
      break;
    }
  }
  const range = right.position - left.position;
  if (range === 0) return left.color;
  const t = (pct - left.position) / range;
  const lc = hexToRgb(left.color);
  const rc = hexToRgb(right.color);
  const r = Math.round(lc.r + (rc.r - lc.r) * t);
  const g = Math.round(lc.g + (rc.g - lc.g) * t);
  const b = Math.round(lc.b + (rc.b - lc.b) * t);
  return rgbToHex(r, g, b);
}

// ── ANGLE WHEEL ────────────────────────────────────────────
function bindAngleWheel() {
  angleInput.addEventListener('input', () => {
    let v = parseInt(angleInput.value);
    if (isNaN(v)) return;
    v = ((v % 360) + 360) % 360;
    state.angle = v;
    angleInput.value = v;
    updateNeedle(v);
    applyPreview();
  });

  let dragging = false;
  let centerX, centerY;

  angleWheel.addEventListener('mousedown', e => {
    dragging = true;
    const rect = angleWheel.getBoundingClientRect();
    centerX = rect.left + rect.width / 2;
    centerY = rect.top + rect.height / 2;
    e.preventDefault();
  });

  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    let angle = Math.round(Math.atan2(dx, -dy) * (180 / Math.PI));
    angle = ((angle % 360) + 360) % 360;
    state.angle = angle;
    angleInput.value = angle;
    updateNeedle(angle);
    applyPreview();
  });

  document.addEventListener('mouseup', () => { dragging = false; });
}

function updateNeedle(angle) {
  angleNeedle.style.transform = `translateX(-50%) rotate(${angle}deg)`;
}

// ── BUILD CSS ──────────────────────────────────────────────
function buildGradientCss() {
  const sorted = [...state.stops].sort((a, b) => a.position - b.position);
  const parts = sorted.map(s => {
    const rgb = hexToRgb(s.color);
    const a = (s.opacity / 100).toFixed(2);
    return `rgba(${rgb.r},${rgb.g},${rgb.b},${a}) ${s.position}%`;
  });
  if (state.gradientType === 'radial') {
    return `radial-gradient(circle, ${parts.join(', ')})`;
  }
  return `linear-gradient(${state.angle}deg, ${parts.join(', ')})`;
}

function buildSingleColorCss() {
  const rgb = hexToRgb(state.singleColor);
  if (state.singleOpacity < 100) {
    const a = (state.singleOpacity / 100).toFixed(2);
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${a})`;
  }
  return state.singleColor;
}

function buildColorValue() {
  return state.mode === 'gradient' ? buildGradientCss() : buildSingleColorCss();
}

// ── APPLY PREVIEW ──────────────────────────────────────────
function applyPreview() {
  const colorVal = buildColorValue();
  const isGrad   = state.mode === 'gradient';

  // Reset classes
  previewInner.className = 'preview-inner';
  previewInner.style.cssText = '';
  previewScreen.style.background = '#141520';

  let cssSnippet = '';

  switch (state.previewMode) {
    case 'bg': {
      previewInner.classList.add('mode-bg');
      previewInner.style.background = colorVal;
      previewInner.innerHTML = '';
      previewScreen.style.background = colorVal;
      cssSnippet = isGrad ? `background: ${colorVal};` : `background-color: ${colorVal};`;
      break;
    }

    case 'button-bg': {
      previewInner.classList.add('mode-button-bg');
      previewInner.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;gap:18px;">
          <button class="preview-btn-demo" style="background:${colorVal}; ${isGrad ? '' : ''}">
            <i class="fa-solid fa-bolt" style="margin-right:8px;"></i> Click Me
          </button>
          <button class="preview-btn-demo" style="background:${colorVal}; opacity:0.8; transform:scale(0.95)">
            Hover State
          </button>
        </div>
      `;
      cssSnippet = isGrad ? `background: ${colorVal};` : `background-color: ${colorVal};`;
      break;
    }

    case 'text': {
      previewInner.innerHTML = `
        <div class="preview-text-demo">
          <h2 style="color:${isGrad ? 'transparent' : colorVal}; ${isGrad ? `background:${colorVal}; -webkit-background-clip:text; -webkit-text-fill-color:transparent;` : ''}">
            Beautiful Typography
          </h2>
          <p style="color:${isGrad ? 'transparent' : colorVal}; ${isGrad ? `background:${colorVal}; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;` : ''}">
            This is how your color looks on text. Pair it with a clean sans-serif for maximum impact and readability.
          </p>
        </div>
      `;
      cssSnippet = isGrad
        ? `background: ${colorVal};\n-webkit-background-clip: text;\n-webkit-text-fill-color: transparent;`
        : `color: ${colorVal};`;
      break;
    }

    case 'border': {
      previewInner.innerHTML = `
        <div class="preview-border-card" style="border-color:${isGrad ? 'transparent' : colorVal}; ${isGrad ? `border-image: ${colorVal} 1;` : ''}">
          <div class="pbc-icon"><i class="fa-solid fa-gem"></i></div>
          <div class="pbc-title">Premium Card</div>
          <div class="pbc-sub">Border colored with your selection</div>
        </div>
      `;
      cssSnippet = isGrad
        ? `border: 3px solid transparent;\nborder-image: ${colorVal} 1;`
        : `border: 3px solid ${colorVal};`;
      break;
    }

    case 'card': {
      previewInner.innerHTML = `
        <div class="preview-card-demo">
          <div class="pcd-header" style="background:${colorVal}">
            <i class="fa-solid fa-image"></i>
          </div>
          <div class="pcd-body">
            <h3>Card Component</h3>
            <p>This card header uses your selected color as the background fill.</p>
            <div class="pcd-tags">
              <span class="pcd-badge">Design</span>
              <span class="pcd-badge">UI/UX</span>
              <span class="pcd-badge">Color</span>
            </div>
          </div>
        </div>
      `;
      cssSnippet = isGrad ? `background: ${colorVal};` : `background-color: ${colorVal};`;
      break;
    }
  }

  // Update CSS output
  state.lastCss = cssSnippet;
  cssOutputText.textContent = cssSnippet;
  infobarCssPreview.textContent = colorVal.substring(0, 70) + (colorVal.length > 70 ? '…' : '');

  // If fullscreen is open, update it too
  updateFullscreen();
}

// ── FULLSCREEN ─────────────────────────────────────────────
function expandPreviewer() {
  fullscreenOverlay.classList.remove('hidden');
  // clone preview-inner content
  fullscreenPreview.innerHTML = '';
  const clone = previewInner.cloneNode(true);
  clone.style.width  = '100vw';
  clone.style.height = '100vh';
  clone.style.borderRadius = '0';
  fullscreenPreview.appendChild(clone);
  fsModeLabel.innerHTML = infobarModeLabel.innerHTML;
  fsCssLabel.textContent = infobarCssPreview.textContent;
  document.body.style.overflow = 'hidden';

  // animate in
  fullscreenOverlay.style.opacity = '0';
  requestAnimationFrame(() => {
    fullscreenOverlay.style.transition = 'opacity 0.3s ease';
    fullscreenOverlay.style.opacity = '1';
  });
}

function collapsePreviewer() {
  fullscreenOverlay.style.opacity = '0';
  setTimeout(() => {
    fullscreenOverlay.classList.add('hidden');
    fullscreenOverlay.style.opacity = '';
    fullscreenOverlay.style.transition = '';
    document.body.style.overflow = '';
  }, 300);
}

function updateFullscreen() {
  if (fullscreenOverlay.classList.contains('hidden')) return;
  const clone = previewInner.cloneNode(true);
  clone.style.width  = '100vw';
  clone.style.height = '100vh';
  clone.style.borderRadius = '0';
  fullscreenPreview.innerHTML = '';
  fullscreenPreview.appendChild(clone);
  fsCssLabel.textContent = infobarCssPreview.textContent;
}

// Escape key closes fullscreen
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !fullscreenOverlay.classList.contains('hidden')) {
    collapsePreviewer();
  }
});

// ── COPY CSS ───────────────────────────────────────────────
function copyCss() {
  applyPreview(); // make sure latest is generated
  const text = state.lastCss;
  if (!text || text === '/* Click Preview to generate */') return;

  navigator.clipboard.writeText(text).then(() => {
    showToast();
  }).catch(() => {
    // Fallback
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast();
  });
}

function showToast() {
  const t = $('toast');
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

// ── UTILS ──────────────────────────────────────────────────
function hexToRgb(hex) {
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const bigint = parseInt(hex, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

// ── UPDATE ANGLE SLIDER (dynamic bg) ──────────────────────
function updateSliderTrack(slider, color) {
  // For opacity slider: show checker behind
  const pct = slider.value + '%';
  slider.style.backgroundImage = `linear-gradient(to right, ${color} 0%, ${color} ${pct}, var(--bg-input) ${pct})`;
}

// Enhance sliders with fill effect
singleOpacitySlider.addEventListener('input', function () {
  const pct = this.value + '%';
  this.style.background = `linear-gradient(to right, var(--accent) 0%, var(--accent) ${pct}, var(--bg-input) ${pct})`;
});
stopPositionSlider.addEventListener('input', function () {
  const pct = this.value + '%';
  this.style.background = `linear-gradient(to right, var(--accent) 0%, var(--accent) ${pct}, var(--bg-input) ${pct})`;
});
stopOpacitySlider.addEventListener('input', function () {
  const pct = this.value + '%';
  this.style.background = `linear-gradient(to right, var(--accent) 0%, var(--accent) ${pct}, var(--bg-input) ${pct})`;
});

// Init sliders visual
function initSliderVisual(slider) {
  const pct = slider.value + '%';
  slider.style.background = `linear-gradient(to right, var(--accent) 0%, var(--accent) ${pct}, var(--bg-input) ${pct})`;
}

// ── THEME TOGGLE ───────────────────────────────────────────
let currentTheme = 'dark';

function toggleTheme() {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme === 'light' ? 'light' : '');
  const label = $('theme-toggle-label');
  if (label) label.textContent = currentTheme === 'light' ? 'Dark Mode' : 'Light Mode';
  localStorage.setItem('chromastudio-theme', currentTheme);
}

function loadSavedTheme() {
  const saved = localStorage.getItem('chromastudio-theme');
  if (saved && saved === 'light') {
    currentTheme = 'light';
    document.documentElement.setAttribute('data-theme', 'light');
    const label = $('theme-toggle-label');
    if (label) label.textContent = 'Dark Mode';
  }
}

// ── KICK OFF ───────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadSavedTheme();
  init();
  initSliderVisual(singleOpacitySlider);
  initSliderVisual(stopPositionSlider);
  initSliderVisual(stopOpacitySlider);

  // set infobar initial label
  infobarModeLabel.innerHTML = '<i class="fa-solid fa-fill-drip"></i> Background Mode';

  // animate section blocks with stagger
  document.querySelectorAll('.section-block').forEach((el, i) => {
    el.style.animationDelay = `${i * 0.05}s`;
  });
});
