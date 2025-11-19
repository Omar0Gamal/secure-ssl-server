import fs from 'fs';

/**
 * Simple debounce implementation
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Watches files for changes and triggers a callback.
 * @param {string[]} paths - Files to watch
 * @param {Function} onChange - Callback when file changes
 */
export function watchFiles(paths, onChange) {
  const handler = debounce(onChange, 500);

  paths.forEach(p => {
    fs.watch(p, { persistent: true }, handler);
  });
}
