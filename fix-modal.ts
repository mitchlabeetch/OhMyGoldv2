import fs from 'fs';

const filePath = 'packages/ui-shared/src/components/Modal/Modal.tsx';
let code = fs.readFileSync(filePath, 'utf-8');

code = code.replace(
`document.body
  );`,
`document.body
  ) as any;`
);

fs.writeFileSync(filePath, code);
