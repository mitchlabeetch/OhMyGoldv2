const fs = require('fs');

const path = 'apps/web/src/App.tsx';
let data = fs.readFileSync(path, 'utf8');

// The `as const` arrays should have been cast to AppRole[] explicitly.
data = data.replace(/roles: \["admin"\] as AppRole\[\]/g, 'roles: ["admin"] as AppRole[]');
data = data.replace(/roles: \["admin", "manager"\] as AppRole\[\]/g, 'roles: ["admin", "manager"] as AppRole[]');

// Actually in App.tsx there are map functions. Let's find those arrays
data = data.replace(/roles: \["admin"\]/g, 'roles: ["admin"] as AppRole[]');
data = data.replace(/roles: \["admin", "manager"\]/g, 'roles: ["admin", "manager"] as AppRole[]');

fs.writeFileSync(path, data);
