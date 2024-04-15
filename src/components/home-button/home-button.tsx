import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
const HomeButton = () => {
  const navigate = useNavigate();
  const handleHome = () => {
    navigate("/")
  };
  return (
    <Button variant="text"  fullWidth={true} sx={{padding: "0.5rem 0.75rem"}} color='info' onClick={handleHome}>Home</Button>
  );
};

export default HomeButton;