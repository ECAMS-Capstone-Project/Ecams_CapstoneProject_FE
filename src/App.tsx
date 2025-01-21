import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { Toaster } from 'react-hot-toast';
import React from "react";

function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </React.StrictMode>
  );
}

export default App;
