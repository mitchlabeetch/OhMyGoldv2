const fs = require('fs');

const file = '/app/apps/mobile/app/(tabs)/_layout.tsx';
let code = fs.readFileSync(file, 'utf8');

const targetFunction = `import { Home, Calendar, QrCode, User } from "lucide-react-native";`;
const replacementFunction = `import { Home, Calendar, QrCode, User, Users, CreditCard } from "lucide-react-native";`;

if (code.includes(targetFunction)) {
  code = code.replace(targetFunction, replacementFunction);
  fs.writeFileSync(file, code);
  console.log("Successfully replaced function.");
} else {
  console.error("Function not found.");
}
