const fs = require('fs');

const path = 'apps/web/src/App.tsx';
let data = fs.readFileSync(path, 'utf8');

if (!data.includes('import type { AppRole }')) {
  data = data.replace('import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";', 'import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";\nimport type { AppRole } from "@ohmygold/shared";');
}

fs.writeFileSync(path, data);
