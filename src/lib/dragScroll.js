// Mouse drag-to-scroll for horizontal swipe rows (carousels, chip rows).
// Touch devices already swipe natively; this gives desktop users the same gesture.
const SELECTOR = '.snap-feed, .snap-x, .no-scrollbar, [data-drag-scroll]';
const IGNORE = 'input, textarea, select, button[role="combobox"], [contenteditable="true"], [data-no-drag-scroll]';

let drag = null;
let suppressClick = false;

function findScroller(start) {
  for (let el = start; el && el !== document.body; el = el.parentElement) {
    if (el.scrollWidth <= el.clientWidth + 1) continue;
    const cs = getComputedStyle(el);
    if (cs.overflowX !== 'auto' && cs.overflowX !== 'scroll') continue;
    if (el.matches(SELECTOR) || cs.scrollbarWidth === 'none') return el;
  }
  return null;
}

function endDrag() {
  if (!drag) return;
  const { el, moved, snap } = drag;
  drag = null;
  if (!moved) return;
  el.style.scrollSnapType = snap;
  el.style.cursor = '';
  el.style.userSelect = '';
  suppressClick = true;
  setTimeout(() => { suppressClick = false; }, 0);
}

export function installDragScroll() {
  if (typeof document === 'undefined' || window.__dragScrollInstalled) return;
  window.__dragScrollInstalled = true;

  document.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0 || e.target.closest(IGNORE)) return;
    const el = findScroller(e.target);
    if (!el) return;
    drag = { el, startX: e.clientX, startLeft: el.scrollLeft, moved: false, snap: el.style.scrollSnapType };
  });

  document.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.startX;
    if (!drag.moved) {
      if (Math.abs(dx) < 6) return;
      drag.moved = true;
      drag.el.style.scrollSnapType = 'none';
      drag.el.style.cursor = 'grabbing';
      drag.el.style.userSelect = 'none';
    }
    drag.el.scrollLeft = drag.startLeft - dx;
  });

  document.addEventListener('pointerup', endDrag);
  document.addEventListener('pointercancel', endDrag);

  document.addEventListener('click', (e) => {
    if (!suppressClick) return;
    e.preventDefault();
    e.stopPropagation();
  }, true);

  document.addEventListener('dragstart', (e) => {
    if (e.target instanceof Element && findScroller(e.target)) e.preventDefault();
  });
}
