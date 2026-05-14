const fs = require('fs');

const file = '/app/packages/ui-shared/src/components/Toast/Toast.tsx';
let code = fs.readFileSync(file, 'utf8');

const endOfFile = `        </div>,
        document.body
      ) as ReactNode}
    </ToastContext.Provider>`;

const endOfFileReplacement = `        </div>,
        document.body
      ) as any}
    </ToastContext.Provider>`;

if (code.includes(endOfFile)) {
  code = code.replace(endOfFile, endOfFileReplacement);
  fs.writeFileSync(file, code);
  console.log("Successfully replaced function.");
} else {
  console.error("Function not found.");
}
