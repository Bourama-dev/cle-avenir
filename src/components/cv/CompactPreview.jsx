import React, { useLayoutEffect, useRef, useState } from 'react';

/**
 * Shows an A4 document (CV or cover letter, 210 × 297 mm) scaled down to fit
 * the available width, so the whole page is visible on phones and narrow
 * columns instead of being cut off on the right.
 *
 * Only the on-screen copy is scaled: the PDF export clones the document
 * element itself, not this wrapper, so it keeps the real A4 size.
 */
const CompactPreview = ({ children }) => {
  const containerRef = useRef(null);
  const pageRef = useRef(null);
  const [fit, setFit] = useState({ scale: 1, width: null, height: null });

  useLayoutEffect(() => {
    const container = containerRef.current;
    const page = pageRef.current;
    if (!container || !page) return undefined;

    const update = () => {
      const styles = getComputedStyle(container);
      const available = container.clientWidth
        - parseFloat(styles.paddingLeft) - parseFloat(styles.paddingRight);
      const pageWidth = page.offsetWidth;
      const pageHeight = page.offsetHeight;
      if (!available || !pageWidth) return;
      const scale = Math.min(1, available / pageWidth);
      setFit((prev) => (
        prev.scale === scale && prev.width === pageWidth && prev.height === pageHeight
          ? prev
          : { scale, width: pageWidth, height: pageHeight }
      ));
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(container);
    observer.observe(page);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="preview-container w-full h-full py-6 px-2 sm:px-6">
      {/* Reserves the scaled size so the column scrolls to the real bottom of the page. */}
      <div
        className="mx-auto"
        style={fit.width ? { width: fit.width * fit.scale, height: fit.height * fit.scale } : undefined}
      >
        <div
          ref={pageRef}
          className="preview-scaler shadow-2xl bg-white w-max"
          style={{ transform: `scale(${fit.scale})`, transformOrigin: 'top left' }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default CompactPreview;
