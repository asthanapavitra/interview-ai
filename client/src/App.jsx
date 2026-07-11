import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./app.routes.jsx";
import { AuthProvider } from "./features/auth/auth.context.jsx";
import {InterviewProvider}from './features/interview/interview.context.jsx'
const App = () => {
  console.log(import.meta.env.VITE_GOOGLE_CLIENT_ID)
  return (
    <AuthProvider>
      <InterviewProvider>
        <RouterProvider router={router} />
      </InterviewProvider>
    </AuthProvider>
  );
};

export default App;
