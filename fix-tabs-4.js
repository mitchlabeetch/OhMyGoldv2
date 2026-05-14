const fs = require('fs');

const file = '/app/apps/mobile/app/(tabs)/_layout.tsx';
let code = fs.readFileSync(file, 'utf8');

const regex = /export default function TabsLayout\(\) {[\s\S]*?}\n\nexport default function TabsLayout\(\) {/m;

if (regex.test(code)) {
  code = code.replace(/export default function TabsLayout\(\) {[\s\S]*?}\n\n/, '');
  fs.writeFileSync(file, code);
  console.log("Successfully replaced function.");
} else {
  console.error("Function not found.");
}
