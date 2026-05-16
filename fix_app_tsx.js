const fs = require('fs');

const path = 'apps/web/src/App.tsx';
let data = fs.readFileSync(path, 'utf8');

// Replace `as const` arrays with normal AppRole[] casting
data = data.replace(/roles: \["admin"\] as const/g, 'roles: ["admin"] as AppRole[]');
data = data.replace(/roles: \["admin", "manager"\] as const/g, 'roles: ["admin", "manager"] as AppRole[]');

// Replace string literals with AppRole[] arrays
data = data.replace(/roles=\{"admin"\}/g, 'roles={["admin"] as AppRole[]}');
data = data.replace(/roles=\{"manager"\}/g, 'roles={["manager"] as AppRole[]}');
data = data.replace(/roles=\{"employee"\}/g, 'roles={["employee"] as AppRole[]}');
data = data.replace(/roles=\{"teacher"\}/g, 'roles={["teacher"] as AppRole[]}');
data = data.replace(/roles=\{"client"\}/g, 'roles={["client"] as AppRole[]}');

data = data.replace(/roles=\{\["admin", "manager", "employee"\]\}/g, 'roles={["admin", "manager", "employee"] as AppRole[]}');
data = data.replace(/roles=\{\["admin", "manager", "teacher"\]\}/g, 'roles={["admin", "manager", "teacher"] as AppRole[]}');
data = data.replace(/roles=\{\["admin", "manager", "employee", "teacher", "client"\]\}/g, 'roles={["admin", "manager", "employee", "teacher", "client"] as AppRole[]}');

fs.writeFileSync(path, data);
