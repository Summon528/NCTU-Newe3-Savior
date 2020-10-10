const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    const el = mutation.target;
    if (el instanceof HTMLDivElement) {
      switch (el.id) {
        case 'divProgress':
        case 'divMaskFrame':
          el.style.display = 'none';
          break;
        case 'page-wrapper':
          el.style.visibility = 'visible';
          el.style.display = 'block';
          break;
        case 'page-footer':
          el.style.display = 'block';
          break;
        default:
          break;
      }
    }
  });
});

observer.observe(document, { childList: true, subtree: true });

document.addEventListener('DOMContentLoaded', () => observer.disconnect());
