const fs = require('fs');

const file = 'packages/ui-shared/src/components/Modal/Modal.tsx';
let code = fs.readFileSync(file, 'utf8');

const targetFunction = `  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>`;

const replacementFunction = `  return (typeof document !== 'undefined' ? createPortal(
    <AnimatePresence>
      {isOpen && (
        <>`;

const targetFunction2 = `        </>
      )}
    </AnimatePresence>,
    document.body
  );
}`;

const replacementFunction2 = `        </>
      )}
    </AnimatePresence>,
    document.body
  ) : null) as React.ReactNode;
}`;

if (code.includes(targetFunction) && code.includes(targetFunction2)) {
  code = code.replace(targetFunction, replacementFunction);
  code = code.replace(targetFunction2, replacementFunction2);
  fs.writeFileSync(file, code);
  console.log("Successfully replaced function.");
} else {
  console.error("Function not found.");
}
