const fs = require('fs');

const file = '/app/apps/mobile/app/(tabs)/_layout.tsx';
let code = fs.readFileSync(file, 'utf8');

const targetFunction = `  return (
    <Tabs`;

const replacementFunction = `export default function TabsLayout() {
  const { session } = useAuthStore();

  if (!session) {
    return <Redirect href="/auth/login" />;
  }

  return (
    <Tabs`;

if (code.includes(targetFunction)) {
  code = code.replace(targetFunction, replacementFunction);
  fs.writeFileSync(file, code);
  console.log("Successfully replaced function.");
} else {
  console.error("Function not found.");
}
