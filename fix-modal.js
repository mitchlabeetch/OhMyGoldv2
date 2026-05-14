const fs = require('fs');

const file = 'packages/ui-shared/src/components/Modal/Modal.tsx';
let code = fs.readFileSync(file, 'utf8');

const targetImport = `import { useEffect, useRef } from "react";`;
const replacementImport = `import React, { useEffect, useRef } from "react";`;

const targetFunction = `export function Modal({
  isOpen,
  onClose,
  title,
  description,
  size = "md",
  children,
  footer,
  persistent = false,
}: ModalProps) {`;

const replacementFunction = `export function Modal({
  isOpen,
  onClose,
  title,
  description,
  size = "md",
  children,
  footer,
  persistent = false,
}: ModalProps): React.ReactNode {`;

if (code.includes(targetImport)) {
  code = code.replace(targetImport, replacementImport);
}

if (code.includes(targetFunction)) {
  code = code.replace(targetFunction, replacementFunction);
  fs.writeFileSync(file, code);
  console.log("Successfully replaced function.");
} else {
  console.error("Function not found.");
}
