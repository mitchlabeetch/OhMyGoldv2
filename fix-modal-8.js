const fs = require('fs');

const file = '/app/packages/ui-shared/src/components/Modal/Modal.tsx';
let code = fs.readFileSync(file, 'utf8');

const targetFunction = `  return createPortal(
    <AnimatePresence>
      {isOpen && (`;

const replacementFunction = `  return createPortal(
    <AnimatePresence>
      {isOpen && (`;

const endOfFile = `      )}
    </AnimatePresence>,
    document.body
  );
}`;

const endOfFileReplacement = `      )}
    </AnimatePresence>,
    document.body
  ) as any;
}`;

if (code.includes(endOfFile)) {
  code = code.replace(endOfFile, endOfFileReplacement);
  fs.writeFileSync(file, code);
  console.log("Successfully replaced function.");
} else {
  console.error("Function not found.");
}
