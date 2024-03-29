import { useAuth0 } from "@auth0/auth0-react";
import Button from '@mui/material/Button';

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <Button  variant="text" onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>Log Out</Button>
    // sx={{ my: 2, color: 'white', display: 'block' }}
  );
};

export default LogoutButton;