const fs = require('fs');

const file = 'packages/ui-shared/src/components/Modal/Modal.tsx';
let code = fs.readFileSync(file, 'utf8');

const targetFunction = `      )}
    </AnimatePresence>,
    document.body
  );
}`;

const replacementFunction = `      )}
    </AnimatePresence>,
    document.body
  ) as React.ReactNode;
}`;

if (code.includes(targetFunction)) {
  code = code.replace(targetFunction, replacementFunction);
  fs.writeFileSync(file, code);
  console.log("Successfully replaced function.");
} else {
  console.error("Function not found.");
}
