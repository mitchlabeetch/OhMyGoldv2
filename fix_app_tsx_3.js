const fs = require('fs');

const path = 'apps/web/src/App.tsx';
let data = fs.readFileSync(path, 'utf8');

data = data.replace(/roles: \["admin"\] as AppRole\[\]/g, 'roles: ["admin"] as const');
data = data.replace(/roles: \["admin", "manager"\] as AppRole\[\]/g, 'roles: ["admin", "manager"] as const');

data = data.replace(/roles=\{\["admin"\] as AppRole\[\]\}/g, 'roles={["admin"]}');
data = data.replace(/roles=\{\["manager"\] as AppRole\[\]\}/g, 'roles={["manager"]}');
data = data.replace(/roles=\{\["employee"\] as AppRole\[\]\}/g, 'roles={["employee"]}');
data = data.replace(/roles=\{\["teacher"\] as AppRole\[\]\}/g, 'roles={["teacher"]}');
data = data.replace(/roles=\{\["client"\] as AppRole\[\]\}/g, 'roles={["client"]}');

data = data.replace(/roles=\{\["admin", "manager", "employee"\] as AppRole\[\]\}/g, 'roles={["admin", "manager", "employee"]}');
data = data.replace(/roles=\{\["admin", "manager", "teacher"\] as AppRole\[\]\}/g, 'roles={["admin", "manager", "teacher"]}');
data = data.replace(/roles=\{\["admin", "manager", "employee", "teacher", "client"\] as AppRole\[\]\}/g, 'roles={["admin", "manager", "employee", "teacher", "client"]}');

// Fix protected route roles prop
fs.writeFileSync(path, data);
