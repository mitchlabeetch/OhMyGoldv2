const fs = require('fs');

const file = '/app/apps/mobile/app/(tabs)/_layout.tsx';
let code = fs.readFileSync(file, 'utf8');

const regex = /import \{ Redirect, Tabs \} from "expo-router";\nimport \{ useAuthStore \} from "\.\.\/\.\.\/src\/stores\/authStore";\nimport \{ Home, Calendar, QrCode, User, Users, CreditCard \} from "lucide-react-native";\n\n  return \(\n    <Tabs\n[\s\S]*?    <\/Tabs>\n  \);\n}\n\nexport default function TabsLayout\(\) \{/m;

if (regex.test(code)) {
  code = code.replace(regex, `import { Redirect, Tabs } from "expo-router";
import { useAuthStore } from "../../src/stores/authStore";
import { Home, Calendar, QrCode, User, Users, CreditCard } from "lucide-react-native";

export default function TabsLayout() {`);
  fs.writeFileSync(file, code);
  console.log("Successfully replaced function.");
} else {
  console.error("Function not found.");
}
