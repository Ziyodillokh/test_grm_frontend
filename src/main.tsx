import "./globals.css";
import "./utils/i18n";

import { NuqsAdapter } from "nuqs/adapters/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { Toaster } from "@/components/ui/sonner";

import App from "./App";
import QueryProvider from "./providers/QueryProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <NuqsAdapter>
        <QueryProvider>
          <App />
          <Toaster richColors />
        </QueryProvider>
      </NuqsAdapter>
    </BrowserRouter>
  </StrictMode>
);
