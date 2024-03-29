import { useAuth0 } from "@auth0/auth0-react";
import Button from '@mui/material/Button';

export const SignupButton = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const handleSignUp = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: "/",
      },
      authorizationParams: {
        screen_hint: "signup",
      },
    });
  };

  if (isAuthenticated) {
    return (
      <Button disabled sx={{padding: "2% 7.5%", backgroundColor: "#262a33"}}  variant="contained" onClick={handleSignUp}>Sign Up</Button>
    );
  }
  return (
    <Button sx={{padding: "2% 7.5%", backgroundColor: "#262a33"}}  variant="contained" onClick={handleSignUp}>Sign Up</Button>
  );
};