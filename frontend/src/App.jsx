import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Perfiles from "./pages/Perfiles";
import Preguntas from "./pages/Preguntas";
import Examenes from "./pages/Examenes";
import Resultados from "./pages/Resultados";
import PresentarExamen from "./pages/PresentarExamen";
import ResponderExamen from "./pages/ResponderExamen";
import ExamenCompletado from "./pages/ExamenCompletado";
import Usuarios from "./pages/Usuarios";

function RutaProtegida({ children }) {
  const { estaAutenticado } = useAuth();
  return estaAutenticado ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/presentar" element={<PresentarExamen />} />
          <Route path="/examen/:intentoId" element={<ResponderExamen />} />
          <Route path="/examen/:intentoId/completado" element={<ExamenCompletado />} />

          <Route
            element={
              <RutaProtegida>
                <Layout />
              </RutaProtegida>
            }
          >
            <Route path="/perfiles" element={<Perfiles />} />
            <Route path="/preguntas" element={<Preguntas />} />
            <Route path="/examenes" element={<Examenes />} />
            <Route path="/resultados" element={<Resultados />} />
            <Route path="/usuarios" element={<Usuarios />} />
          </Route>

          <Route path="*" element={<Navigate to="/perfiles" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;