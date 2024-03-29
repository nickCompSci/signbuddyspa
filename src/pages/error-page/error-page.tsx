import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
const ErrorPage = () => {
  const navigate = useNavigate();
  const handleButtonPress = async () => {
    navigate("/")
  };

  return (
    <div>
    <Stack component="section" sx={{ padding: "5%", marginTop: "40%"}} >
      <Typography sx={{textAlign: "center", marginBottom: "10%"}} variant="h3" component="h3">
      Oops! You have hit a 404!
    </Typography>
      <Button sx={{margin: "0 auto"}} onClick={handleButtonPress} variant="contained">Back to home</Button>
    </Stack>
    <div>
      
    </div>

</div>
  )
}

export default ErrorPage