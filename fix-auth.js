const fs = require('fs');

const file = '/app/apps/mobile/src/stores/authStore.ts';
let code = fs.readFileSync(file, 'utf8');

const targetFunction = `      fetchProfile: async () => {`;
const replacementFunction = `      setProfile: async () => {`;

if (code.includes(targetFunction)) {
  code = code.replace(targetFunction, replacementFunction);
  fs.writeFileSync(file, code);
  console.log("Successfully replaced function.");
} else {
  console.error("Function not found.");
}
