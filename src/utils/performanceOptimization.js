/**
 * Utility for performance optimization including lazy loading and rendering hints
 */

// Observe elements and load background images or src when they enter viewport
export const lazyLoadImages = () => {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const image = entry.target;
          const src = image.getAttribute('data-src');
          const bg = image.getAttribute('data-bg');

          if (src) {
            image.src = src;
            image.removeAttribute('data-src');
          }
          
          if (bg) {
            image.style.backgroundImage = `url(${bg})`;
            image.removeAttribute('data-bg');
          }

          image.classList.add('loaded');
          observer.unobserve(image);
        }
      });
    });

    const lazyImages = document.querySelectorAll('[data-src], [data-bg]');
    lazyImages.forEach((img) => {
      imageObserver.observe(img);
    });
    
    return () => {
      lazyImages.forEach((img) => {
        imageObserver.unobserve(img);
      });
    };
  }
  return () => {};
};

// Apply will-change property to elements that will be blurred/animated to promote them to their own layer
export const optimizeBlurredContent = (selector = '.blur-content') => {
  const elements = document.querySelectorAll(selector);
  elements.forEach(el => {
    el.style.willChange = 'filter, transform';
  });
  
  // Clean up function to remove hint after animation might be done (optional/context dependent)
  // For static blurred content, we might want to leave it or remove it if it causes memory issues.
  // Here we just return a cleanup that resets it.
  return () => {
    elements.forEach(el => {
      el.style.willChange = 'auto';
    });
  };
};

export const preloadCriticalImages = (urls) => {
  urls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
};