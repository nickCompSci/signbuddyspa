import { useAuth0 } from "@auth0/auth0-react";
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const LoginButton = () => {
  const navigate = useNavigate();
  const { loginWithRedirect } = useAuth0();
  const { isAuthenticated } = useAuth0();
  const handleLogin = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: "/login",
      },
    });
  };
  const handleGo = () => {
    navigate("/alphabet")
  };

  if (isAuthenticated) {
    return (
      <Button sx={{padding: "0 7.5%"}} variant="contained"  onClick={handleGo}>Go</Button>
    )
  }
  return (
    <Button sx={{padding: "0 7.5%"}} variant="contained" onClick={handleLogin}>Log In </Button>
  )
};

export default LoginButton;