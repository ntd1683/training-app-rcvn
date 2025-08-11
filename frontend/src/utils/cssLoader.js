export const loadCSS = (href) => {
  return new Promise((resolve, reject) => {
    const existingLink = document.querySelector(`link[href="${href}"]`);
    if (existingLink) {
      resolve();
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.onload = resolve;
    link.onerror = reject;
    document.head.appendChild(link);
  });
};

export const removeCSS = (href) => {
  const link = document.querySelector(`link[href="${href}"]`);
  if (link) {
    document.head.removeChild(link);
  }
};