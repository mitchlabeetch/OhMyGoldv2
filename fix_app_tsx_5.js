const fs = require('fs');

const path = 'apps/web/src/App.tsx';
let data = fs.readFileSync(path, 'utf8');

data = data.replace(/roles=\{\["admin"\]\}/g, 'roles={["admin"]}');
data = data.replace(/roles=\{\["manager"\]\}/g, 'roles={["admin"]}');
data = data.replace(/roles=\{\["employee"\]\}/g, 'roles={["receptionist"]}');
data = data.replace(/roles=\{\["teacher"\]\}/g, 'roles={["coach"]}');
data = data.replace(/roles=\{\["client"\]\}/g, 'roles={["member"]}');

data = data.replace(/roles=\{\["admin", "manager", "employee"\]\}/g, 'roles={["admin", "receptionist"]}');
data = data.replace(/roles=\{\["admin", "manager", "teacher"\]\}/g, 'roles={["admin", "coach"]}');
data = data.replace(/roles=\{\["admin", "manager", "employee", "teacher", "client"\]\}/g, 'roles={["admin", "receptionist", "coach", "member"]}');

fs.writeFileSync(path, data);
