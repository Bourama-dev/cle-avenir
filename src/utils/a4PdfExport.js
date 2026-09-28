import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// Exports an A4 document element (CV or cover letter template, 210 × 297 mm)
// to a one-page PDF that recruiting software (ATS) can read.
//
// The page is still drawn from a screenshot, so it looks exactly like the
// preview, but every line of text is also written into the PDF as invisible
// text at the same position — the way scanned documents get an OCR layer.
// Without it the PDF is only a picture: an ATS reads it as a blank page and
// recruiters can't copy or search anything.

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const PT_PER_MM = 72 / 25.4;

// Characters the standard PDF fonts can encode (Latin-1 + Windows-1252
// extras such as € ’ “ ” – — • œ). Anything else (emoji, arrows, icons)
// would come out as garbage in the extracted text, so it is dropped.
const CP1252_EXTRAS = '€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ';
const toEncodable = (text) => Array.from(text)
  .map((ch) => (ch.charCodeAt(0) <= 0xff || CP1252_EXTRAS.includes(ch) ? ch : ' '))
  .join('')
  .replace(/\s+/g, ' ');

/**
 * Renders the element detached from the page, at its real size: the on-screen
 * preview may be scaled down to fit the screen.
 */
function mountOffscreenCopy(element) {
  const host = document.createElement('div');
  host.style.cssText = 'position:fixed;left:-10000px;top:0;z-index:-1;pointer-events:none;';
  const copy = element.cloneNode(true);
  copy.removeAttribute('id');
  host.appendChild(copy);
  document.body.appendChild(host);
  return { host, copy };
}

/** Lines of visible text with their box, in document order (keeps columns apart). */
function collectTextLines(root) {
  const lines = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const range = document.createRange();

  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const parent = node.parentElement;
    if (!parent || !node.textContent.trim()) continue;
    const style = getComputedStyle(parent);
    if (style.visibility === 'hidden' || style.display === 'none' || Number(style.opacity) === 0) continue;
    const fontSize = parseFloat(style.fontSize) || 12;

    let current = null;
    const flush = () => {
      if (current) lines.push(current);
      current = null;
    };
    for (const match of node.textContent.matchAll(/\S+/g)) {
      range.setStart(node, match.index);
      range.setEnd(node, match.index + match[0].length);
      const rect = range.getClientRects()[0];
      if (!rect || !rect.width) continue;
      if (current && Math.abs(rect.top - current.top) < fontSize * 0.5) {
        current.text += ` ${match[0]}`;
        current.right = rect.right;
      } else {
        flush();
        current = {
          text: match[0], left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom, fontSize,
        };
      }
    }
    flush();
  }
  range.detach?.();
  return lines;
}

/**
 * @param {HTMLElement} element the template root (210 × 297 mm)
 * @param {string} filename
 * @param {{title?: string, author?: string}} [meta] PDF properties, also read by ATS
 */
export async function exportA4Pdf(element, filename, meta = {}) {
  if (!element) return;
  if (document.fonts?.ready) await document.fonts.ready;

  const { host, copy } = mountOffscreenCopy(element);
  try {
    const box = copy.getBoundingClientRect();
    const mmPerPx = A4_WIDTH_MM / box.width;

    const canvas = await html2canvas(copy, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      scrollX: 0,
      scrollY: 0,
      windowWidth: document.documentElement.clientWidth,
    });
    const lines = collectTextLines(copy);

    const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait', compress: true });
    // Exactly one page: the templates are fixed at 297 mm and clip overflow.
    const imageHeight = Math.min(A4_HEIGHT_MM, (canvas.height / canvas.width) * A4_WIDTH_MM);
    pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, A4_WIDTH_MM, imageHeight);

    pdf.setFont('helvetica', 'normal');
    for (const line of lines) {
      const text = toEncodable(line.text).trim();
      const y = (line.bottom - box.top - line.fontSize * 0.22) * mmPerPx; // ≈ baseline
      if (!text || y <= 0 || y > A4_HEIGHT_MM) continue;
      const x = (line.left - box.left) * mmPerPx;
      pdf.setFontSize(line.fontSize * mmPerPx * PT_PER_MM);
      // Stretch the invisible text to the visible line so selection lines up.
      const naturalWidth = pdf.getTextWidth(text);
      const targetWidth = (line.right - line.left) * mmPerPx;
      const horizontalScale = naturalWidth > 0 ? targetWidth / naturalWidth : 1;
      pdf.text(text, x, y, { renderingMode: 'invisible', horizontalScale });
    }

    pdf.setProperties({
      title: meta.title || filename.replace(/\.pdf$/i, ''),
      author: meta.author || '',
      creator: 'CléAvenir',
    });
    pdf.save(filename);
  } finally {
    host.remove();
  }
}
