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
import axios from 'axios';
import CircularProgress, {
  circularProgressClasses,
  CircularProgressProps,
} from '@mui/material/CircularProgress';
import { useAuth0 } from "@auth0/auth0-react";

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
  const { getAccessTokenSilently } = useAuth0();
  const { isAuthenticated, isLoading } = useAuth0();
  const [isReady, setIsReady] = useState<{ loading: boolean; alphabet: AlphabetCourse }>({
    loading: true,
    alphabet: { name: '', progress: 0, letters: {} },
  });
  useEffect(() => {
    let isMounted = true;
    const getAllInformation = async () => {

      const accessToken = await getAccessTokenSilently();
      console.log(accessToken);

      axios.get(import.meta.env.VITE_SIGNBUDDY_ALPHABETCOURSE_URI, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      })
        .then(res => {
          console.log(res);
          console.log(res.data.alphabet);
          console.log("hi");
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

  const handleOnCardClick = (letter: string) => {
    navigate(`/learnletter/${letter}`, { state: letter })
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

            <Grid container spacing={{ xs: 4, md: 6 }} columns={{ xs: 4, sm: 4, md: 4, lg: 4 }} sx={{ marginBottom: "5%" }}>
              <Grid xs={2} sm={2} md={2} lg={2} key={1}>
                <List >
                  <ListItem >
                    <ListItemText primary="To complete this course you are required to:" />
                  </ListItem>
                  <ListItem >
                    <AssignmentIcon sx={{ color: "grey", paddingRight: "1%" }} />
                    <ListItemText primary="Complete each letter successfully." />
                  </ListItem>
                  <ListItem>
                    <AssignmentIcon sx={{ color: "grey", paddingRight: "1%" }} />
                    <ListItemText primary="Each letter has to be successfully done 3 times out of 5 attempts." />
                  </ListItem>
                  <ListItem>
                    <AssignmentIcon sx={{ color: "grey", paddingRight: "1%" }} />
                    <ListItemText primary="If you fail 3 times or more, the successful attempts reset." />
                  </ListItem>
                </List>
              </Grid>
              <Grid xs={2} sm={2} md={2} lg={2} key={2}>
                <Box sx={{ width: "100%" }}>
                  <Typography component="p" sx={{ textAlign: "center", marginBottom: "2%" }}>
                    Overall Completion
                  </Typography>
                  <Box sx={{ width: "100%", position: 'relative', justifyContent: "center", alignContent: "center", alignItems: "center", display: 'inline-flex' }}>
                    <CircularProgress
                      variant="determinate"
                      sx={{
                        color: (theme) =>
                          theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
                      }}
                      size={"12rem"}
                      {...props}
                      value={100}
                    />
                    <CircularProgress {...props} sx={{
                      position: 'absolute', [`& .${circularProgressClasses.circle}`]: {
                        strokeLinecap: 'round',
                      },
                    }} size={"12rem"} variant="determinate" value={isReady.alphabet.progress} />
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
                        sx={{ color: "white", fontSize: "3rem" }}
                      >{`${Math.round(isReady.alphabet.progress)}%`}</Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>

            <div style={{ display: 'flex', paddingLeft: '5%', paddingRight: "5%" }}>
              <Box sx={{ width: "100%" }}>
                <Grid container spacing={{ xs: 4, md: 6 }} columns={{ xs: 4, sm: 8, md: 8, lg: 12 }}>
                  {itemData.map((item, index) => (
                    <Grid xs={2} sm={2} md={2} lg={2} key={index}>
                      <Card sx={{ maxWidth: 200 }}>
                        <CardActionArea onClick={() => handleOnCardClick(item.title)}>
                          <CardMedia
                            component="img"
                            image={item.img}
                            alt="green iguana"
                            sx={{ maxHeight: 200, objectFit: "contain" }}
                          />
                          <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                              {item.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Progress: {isReady.alphabet.letters[item.title].completed === 1 ? <Typography variant='overline' sx={{ fontSize: "1em", color: "green" }}>Complete</Typography> : <Typography variant='overline' sx={{ fontSize: "1em", color: "orange" }}>Incomplete</Typography>}
                            </Typography>
                            <Divider sx={{ borderColor: "grey", marginBottom: "2%" }} />
                            <Typography variant="body2" color="text.secondary">
                              Date: {isReady.alphabet.letters[item.title].date_completed === null ? isReady.alphabet.letters[item.title].date_completed : isReady.alphabet.letters[item.title].date_completed}
                            </Typography>
                            <Divider sx={{ borderColor: "grey", marginBottom: "2%" }} />
                            <Typography variant="body2" color="text.secondary">
                              Total Attempts: {isReady.alphabet.letters[item.title].totalAttempts}
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