const fs = require('fs');

const file = 'packages/ui-shared/src/components/Toast/Toast.tsx';
let code = fs.readFileSync(file, 'utf8');

const targetFunction = `    <ToastContext.Provider value={{ toasts, toast, dismiss, dismissAll }}>
      {children}
      {createPortal(
        <div
          className="fixed top-4 right-4 z-[60] flex flex-col gap-2"
          aria-label="Notifications"
          aria-live="polite"
        >
          <AnimatePresence mode="popLayout">
            {toasts.map((t) => (
              <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
            ))}
          </AnimatePresence>
        </div>,
        document.body
      )}
    </ToastContext.Provider>`;

const replacementFunction = `    <ToastContext.Provider value={{ toasts, toast, dismiss, dismissAll }}>
      {children}
      {typeof document !== 'undefined' && createPortal(
        <div
          className="fixed top-4 right-4 z-[60] flex flex-col gap-2"
          aria-label="Notifications"
          aria-live="polite"
        >
          <AnimatePresence mode="popLayout">
            {toasts.map((t) => (
              <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
            ))}
          </AnimatePresence>
        </div>,
        document.body
      ) as ReactNode}
    </ToastContext.Provider>`;

if (code.includes(targetFunction)) {
  code = code.replace(targetFunction, replacementFunction);
  fs.writeFileSync(file, code);
  console.log("Successfully replaced function.");
} else {
  console.error("Function not found.");
}
