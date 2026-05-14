const fs = require('fs');

const file = '/app/apps/mobile/src/stores/authStore.ts';
let code = fs.readFileSync(file, 'utf8');

const targetFunction = `  initialize: () => Promise<void>;
  signOut: () => Promise<void>;
}`;

const replacementFunction = `  initialize: () => Promise<void>;
  signOut: () => Promise<void>;
  fetchProfile: (userId: string) => Promise<void>;
}`;

if (code.includes(targetFunction)) {
  code = code.replace(targetFunction, replacementFunction);
  fs.writeFileSync(file, code);
  console.log("Successfully replaced function.");
} else {
  console.error("Function not found.");
}
