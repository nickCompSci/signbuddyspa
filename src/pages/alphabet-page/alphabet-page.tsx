import AssignmentIcon from '@mui/icons-material/Assignment';
import Divider from '@mui/material/Divider';
import { useNavigate } from 'react-router-dom';
import {A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z} from "../../assets/Alphabet"
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ResponsiveNavbar from '../../components/navbar/navbar';
import "./alphabet-page.scss";
import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { useState, useEffect } from "react";
import FlagIcon from '@mui/icons-material/Flag';
import axios from 'axios';
import CircularProgress, {
  circularProgressClasses,
  CircularProgressProps,
} from '@mui/material/CircularProgress';
import { useAuth0 } from "@auth0/auth0-react";
import Footer from "../../components/footer/footer";


interface Letter {
  completed: number;
  successfulAttempts: number;
  failedAttempts: number;
  failQuota: number;
  totalAttempts: number;
  totalSuccessful: number;
  date_completed?: string | null;
}

interface AlphabetCourse {
  name: string;
  progress: number;
  letters: { [key: string]: Letter };
}

export default function AlphabetPage(props: CircularProgressProps) {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const { getAccessTokenSilently } = useAuth0();
  const {user, isAuthenticated, isLoading } = useAuth0();
  const [isReady, setIsReady] = useState<{ loading: boolean; alphabet: AlphabetCourse }>({
    loading: true,
    alphabet: { name: '', progress: 0, letters: {} },
  });
  useEffect(() => {
    let isMounted = true;
    const getAllInformation = async () => {

      const accessToken = await getAccessTokenSilently();


      axios.get(import.meta.env.VITE_SIGNBUDDY_ALPHABETCOURSE_URI, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      })
        .then(res => {
          setIsReady({ loading: false, alphabet: res.data.alphabet })
        })
        .catch(err => {
          console.log(err)
        })

      if (!isMounted) {
        return;
      }
    };
    getAllInformation();

    return () => {
      isMounted = false;
    };
  }, [getAccessTokenSilently]);


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // You can adjust the threshold as needed
    };

    // Initial check on component mount
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleOnCardClick = (letter: string, letterObject: Letter) => {
    navigate(`/learnletter/${letter}`, { state: {letter, letterObject} })
  }

  if (isLoading) {
    return <div>loading</div>;
  }

  return (
    isAuthenticated && (
      <div>
        {!isReady.loading && (
          <div>
            <ResponsiveNavbar />
            <Typography gutterBottom variant="h2" component="p" sx={{ textAlign: "center" }}>
              ASL Alphabet
            </Typography>

            <Divider sx={{ borderColor: "white", marginBottom: "2%" }} />

            <Grid container  columns={{ xs: 4, sm: 4, md: 4, lg: 4 }} sx={{ marginBottom: "5%" }}>
              <Grid xs={4} sm={4} md={2} lg={2} key={1}>
                <List sx={{marginLeft: "5%"}}>
                {user && (
                  <ListItem >
                  {user && (<ListItemText disableTypography primary={<Typography
                  sx={{textAlign: "center"}} component="h4" variant='h4'> Hello {user?.nickname && user.nickname.charAt(0).toUpperCase() + user.nickname.slice(1)}
                  </Typography>} />)}
                  </ListItem>
                  )}
                  
                  <ListItem >
                    <FlagIcon fontSize='large' sx={{ color: "green", paddingRight: "2%" }} />
                    <ListItemText primary="To complete this course you are required to:" />
                  </ListItem>
                  <ListItem>
                    <AssignmentIcon fontSize='large' sx={{ color: "#1976d2", paddingRight: "2%" }} />
                    <ListItemText primary="You must get each letter correct 3 out 5 times. Otherwise you restart the letter." />
                  </ListItem>
                  <ListItem >
                    <AssignmentIcon fontSize='large' sx={{ color: "#1976d2", paddingRight: "2%" }} />
                    <ListItemText primary="Complete each letter successfully." />
                  </ListItem>
                </List>
              </Grid>

              <Grid sx={isMobile ? {paddingTop: "0"} :{paddingTop: "1.5%"}} xs={4} sm={4} md={2} lg={2} key={2}>
                <Box sx={{ width: "100%" }}>
                  <Typography component="h5" variant='h5' sx={{ textAlign: "center", marginBottom: "2%" }}>
                    Progress
                  </Typography>
                  <Box sx={{ width: "100%", position: 'relative', justifyContent: "center", alignContent: "center", alignItems: "center", display: 'inline-flex' }}>
                    <CircularProgress
                      variant="determinate"
                      sx={{
                        color: (theme) =>
                          theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
                      }}
                      size={isMobile ? "10rem" : "12rem"}

                      {...props}
                      value={100}
                    />
                    <CircularProgress {...props} sx={{
                      position: 'absolute', [`& .${circularProgressClasses.circle}`]: {
                        strokeLinecap: 'round', color: "green"
                      },
                    }} size={isMobile ? "10rem" : "12rem"} variant="determinate" value={isReady.alphabet.progress} />
                    <Box
                      sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography
                        variant="caption"
                        component="div"
                        sx={{ color: "white", fontSize: "2rem"}}
                      >{`${Math.round(isReady.alphabet.progress)}%`}</Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
            
            <Typography component="p"  sx={{ textAlign: "center", marginBottom: "4%" }}>
                    Click any letter below and begin practicing
                  </Typography>
            <div style={{ display: 'flex', paddingLeft: '5%', paddingRight: "5%" }}>
              <Box sx={{ width: "100%" }}>
                <Grid container spacing={{ xs: 4, md: 6 }} columns={{ xs: 4, sm: 6, md: 8, lg: 10 }}>
                  {itemData.map((item, index) => (
                    <Grid xs={2} sm={2} md={2} lg={2} key={index}>
                      <Card sx={ isReady.alphabet.letters[item.title].completed === 1 ? { maxWidth: 200, border: "7px solid green"}: {maxWidth: 200, border: "0"} }>
                        <CardActionArea onClick={() => handleOnCardClick(item.title, isReady.alphabet.letters[item.title])}>
                          <CardMedia
                            component="img"
                            image={item.img}
                            alt={`Letter ${item.title}`}
                            sx={{ maxHeight: 200, objectFit: "contain" }}
                          />
                          <CardContent>
                            <Typography gutterBottom variant="h5" sx={{textAlign: "center"}} component="div">
                              {item.title}
                            </Typography>
                            <Divider sx={{ borderColor: "grey", marginBottom: "2%" }} />
                            <Typography variant="body2" color="text.secondary">
                               {isReady.alphabet.letters[item.title].completed === 1 ? <Typography variant='overline' sx={isMobile ? { fontSize: "0.8em", color: "green" } : { fontSize: "1em", color: "green" }}>Complete</Typography> : <Typography variant='overline' sx={isMobile ? { fontSize: "0.8em", color: "orange" } : { fontSize: "1em", color: "orange" }}>Incomplete</Typography>}
                            </Typography>
                            <Divider sx={{ borderColor: "grey", marginBottom: "2%" }} />
                            {/* <Typography variant="body2" color="text.secondary">
                              Date: {isReady.alphabet.letters[item.title].date_completed === null ? isReady.alphabet.letters[item.title].date_completed : isReady.alphabet.letters[item.title].date_completed}
                            </Typography>
                            <Divider sx={{ borderColor: "grey", marginBottom: "2%" }} /> */}
                            <Typography variant="body2" color="text.secondary">
                              Attempts: {isReady.alphabet.letters[item.title].totalAttempts}
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </div>
          </div>
        )}
        <Footer></Footer>
      </div>
    )

  );
}

const itemData = [
  {
    img: A,
    title: 'A',
  },
  {
    img: B,
    title: 'B',
  },
  {
    img: C,
    title: 'C',
  },
  {
    img: D,
    title: 'D',
  },
  {
    img: E,
    title: 'E',
  },
  {
    img: F,
    title: 'F',
  },
  {
    img: G,
    title: 'G',
  },
  {
    img: H,
    title: 'H',
  },
  {
    img: I,
    title: 'I',
  },
  {
    img: J,
    title: 'J',
  },
  {
    img: K,
    title: 'K',
  },
  {
    img: L,
    title: 'L',
  },
  {
    img: M,
    title: 'M',
  },
  {
    img: N,
    title: 'N',
  },
  {
    img: O,
    title: 'O',
  },
  {
    img: P,
    title: 'P',
  },
  {
    img: Q,
    title: 'Q',
  },
  {
    img: R,
    title: 'R',
  },
  {
    img: S,
    title: 'S',
  },
  {
    img: T,
    title: 'T',
  },
  {
    img: U,
    title: 'U',
  },
  {
    img: V,
    title: 'V',
  },
  {
    img: W,
    title: 'W',
  },
  {
    img: X,
    title: 'X',
  },
  {
    img: Y,
    title: 'Y',
  },
  {
    img: Z,
    title: 'Z',
  },
];