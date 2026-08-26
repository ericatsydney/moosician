const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');
const header = fs.readFileSync(path.join(projectRoot, 'components', 'header.html'), 'utf8');
const styles = fs.readFileSync(path.join(projectRoot, 'assets', 'css', 'styles.css'), 'utf8');

assert.equal(header.includes('site-nav'), false, 'header should not include the single-page site navigation');
assert.equal(styles.includes('site-nav'), false, 'stylesheet should not include unused site navigation rules');

console.log('Header navigation regression check passed.');
