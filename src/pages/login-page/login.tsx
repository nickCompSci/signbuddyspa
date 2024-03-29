import { useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from 'react-router-dom';
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const LoginForm = () => {

  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();
  const {isLoading, isAuthenticated } = useAuth0();

  useEffect(() => {
    const getAlphabet = async () => {

    if (isAuthenticated){
      console.log("logged in!");

      const accessToken = await getAccessTokenSilently();
      axios.get(import.meta.env.VITE_SIGNBUDDY_CHECKCOURSE_URI, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        navigate("/alphabet");
      })
      .catch(err => {
        console.log(err)
      })
    }
    
    }
    getAlphabet();
  }, [isAuthenticated, navigate, getAccessTokenSilently]);


  if (isLoading || isAuthenticated) {
    <Backdrop
    sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
    open={true}
  >
    <CircularProgress color="inherit" />
  </Backdrop>
  }

};

export default LoginForm;

