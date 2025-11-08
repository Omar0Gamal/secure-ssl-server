import fs from 'fs';
import debounce from 'lodash.debounce';

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
