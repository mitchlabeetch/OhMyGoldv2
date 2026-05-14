const fs = require('fs');

const file = '/app/apps/mobile/app/(tabs)/index.tsx';
let code = fs.readFileSync(file, 'utf8');

const regex = /export default function HomeScreen\(\) {[\s\S]*?}\n\nconst styles = StyleSheet\.create\({[\s\S]*?}\);\n\nexport default function DashboardScreen\(\) {/m;

if (regex.test(code)) {
  code = code.replace(/export default function HomeScreen\(\) {[\s\S]*?}\n\nconst styles = StyleSheet\.create\({[\s\S]*?}\);\n\n/, '');
  fs.writeFileSync(file, code);
  console.log("Successfully replaced function.");
} else {
  console.error("Function not found.");
}
