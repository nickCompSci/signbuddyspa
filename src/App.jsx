import LearnPage from "./pages/learn-page/Learn-page"; 
import AlphabetPage from "./pages/alphabet-page/alphabet-page";
import LoginForm from "./pages/login-page/login";
import { Routes, Route } from 'react-router-dom';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { AuthenticationGuard } from "./guards/authentication-guard";
import { useAuth0 } from "@auth0/auth0-react";
import LandingPage from "./pages/landing-page/landing-page"
import ErrorPage from "./pages/error-page/error-page"
const App = () => {
  const { isLoading } = useAuth0();
  if (isLoading) {
    return (
      <div className="page-layout">
        Redirecting...
      </div>
    );
  }
  return (
      <Routes>
        <Route path="/login" element={<AuthenticationGuard component={LoginForm} />} />
        {/* <Route path="/register" element={<SignupForm />} /> */}
        <Route path="/alphabet" element={<AuthenticationGuard component={AlphabetPage} />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="*" element={<ErrorPage />} />
        <Route path="/learnletter/:id" element={<AuthenticationGuard component={LearnPage} />} />
      </Routes>
  );
};

export default App;