const fs = require('fs');

const file = '/app/packages/ui-shared/src/components/Modal/Modal.tsx';
let code = fs.readFileSync(file, 'utf8');

const targetFunction = `export function Modal({
  isOpen,
  onClose,
  title,
  description,
  size = "md",
  children,
  footer,
  persistent = false,
}: ModalProps): React.ReactNode {`;

const replacementFunction = `export function Modal({
  isOpen,
  onClose,
  title,
  description,
  size = "md",
  children,
  footer,
  persistent = false,
}: ModalProps) {`;

if (code.includes(targetFunction)) {
  code = code.replace(targetFunction, replacementFunction);
  fs.writeFileSync(file, code);
  console.log("Successfully replaced function.");
} else {
  console.error("Function not found.");
}
