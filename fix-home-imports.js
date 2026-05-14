const fs = require('fs');

const file = '/app/apps/mobile/app/(tabs)/index.tsx';
let code = fs.readFileSync(file, 'utf8');

const targetFunction = `import { useAuthStore } from "../../src/stores/authStore";`;
const replacementFunction = `import { useAuthStore } from "../../src/stores/authStore";
import { useTranslation } from "react-i18next";`;

if (code.includes(targetFunction)) {
  code = code.replace(targetFunction, replacementFunction);
  fs.writeFileSync(file, code);
  console.log("Successfully replaced function.");
} else {
  console.error("Function not found.");
}
