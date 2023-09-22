import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "layouts/admin";
import AuthLayout from "layouts/auth";

import { AuthProvider, useAuth } from "contexts/user/AuthContext";
import { ProjectProvider } from "contexts/projects/ProjectContext";
import { TestProvider } from "contexts/tests/TestContext";

const App = () => {
  
  return (
    <AuthProvider>
      <ProjectProvider>
        <TestProvider>
          <Routes>
            <Route path="auth/*" element={<AuthLayout />} />
            <Route path="admin/*" element={<AdminLayout />} />
            <Route path="/" element={<Navigate to="/admin" replace />} />
          </Routes>
        </TestProvider>
      </ProjectProvider>
    </AuthProvider>
  );
};

export default App;
