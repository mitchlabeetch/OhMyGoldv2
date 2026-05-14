const fs = require('fs');

const path = 'apps/web/src/components/auth/ProtectedRoute.tsx';
let data = fs.readFileSync(path, 'utf8');

data = data.replace('roles?: AppRole | AppRole[];', 'roles?: AppRole | readonly AppRole[];');
data = data.replace('role?: AppRole | AppRole[];', 'role?: AppRole | readonly AppRole[];');
data = data.replace('const allowed = Array.isArray(roles) ? roles.includes(userRole) : userRole === roles;', 'const allowed = Array.isArray(roles) ? roles.includes(userRole as any) : userRole === roles;');
data = data.replace('const allowed = Array.isArray(role) ? role.includes(userRole) : userRole === role;', 'const allowed = Array.isArray(role) ? role.includes(userRole as any) : userRole === role;');

fs.writeFileSync(path, data);
