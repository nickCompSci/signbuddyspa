import { useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import LoginButton from '../../components/login/auth';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from 'react-router-dom';
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
      .then(res => {

        console.log(res);
        navigate("/hub");
      })
      .catch(err => {
        console.log(err)
      })
    }
    
    }
    getAlphabet();
  }, [isAuthenticated, navigate, getAccessTokenSilently]);


  if (isLoading || isAuthenticated) {
    return <div>Redirecting....</div>;
  }

  if (!isAuthenticated) {
  return (
    
    <div className='form_container'>
    <h1>Login</h1>

    <div> <Link to="/register">Do not have an account? Register here</Link></div>
    <LoginButton/>
    </div>
  );}
};

export default LoginForm;

