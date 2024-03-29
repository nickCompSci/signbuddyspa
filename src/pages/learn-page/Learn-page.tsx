import Webcam from "react-webcam";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import IconButton from "@mui/material/IconButton";
import ReplayIcon from "@mui/icons-material/Replay";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import "./Learn-page.scss";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import letterDescription from "../../data/letter-descriptions.json";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from "@mui/material/Snackbar";
import Container from "@mui/material/Container";
import ResponsiveNavbar from "../../components/navbar/navbar";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import * as letterImages from "../../assets/Alphabet";
import { useLocation } from "react-router-dom";
import Divider from "@mui/material/Divider";
import Alert from "@mui/material/Alert";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useAuth0 } from "@auth0/auth0-react";
import CheckIcon from "@mui/icons-material/Check";
import SendIcon from "@mui/icons-material/Send";
import Stack from "@mui/material/Stack";
import Footer from "../../components/footer/footer";
interface LetterDescriptions {
  [key: string]: string;
}
interface LetterImages {
  [key: string]: string;
}

interface Letter {
  completed: number;
  successfulAttempts: number;
  failedAttempts: number;
  failQuota: number;
  totalAttempts: number;
  totalSuccessful: number;
  date_completed?: string | null;
}


const LearnPage = () => {
  const location = useLocation();
  const { user } = useAuth0();
  const letters: LetterDescriptions = letterDescription;
  const letterImgs: LetterImages = letterImages;
  const webcamRef = useRef<Webcam>(null);
  const [isWebcamActive, setWebcamActive] = useState<boolean>(false);
  const [imgSrc, setImgSrc] = useState<string | null>("");
  const [resultImgSrc, setResultImgSrc] = useState<string | null>("");
  const [timer, setTimer] = useState<number>(3);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [isUserReady, setIsUserReady] = useState<boolean>(false);
  const [isResultReceived, setIsResultReceived] = useState<boolean>(false);
  const [isNotifyUserResult, setNotifyUserResult] = useState<boolean>(false);
  const [resultPredictions, setResultPredictions] = useState<string | null>("");
  const [isLetterResults, setIsLetterResults] = useState<{ letter: Letter }| null>(null);
  const whichLetter: string = location.state;
  const { getAccessTokenSilently } = useAuth0();
  const { isAuthenticated } = useAuth0();
  // const [apiResult, setApiResult] = useState<>

  const [openLoader, setOpenLoader] = useState(false);
  const handleNotifyUserClose = () => {
    setNotifyUserResult(false);
  };

  const vertical = "top";
  const horizontal = "right";

  const onUserMedia = () => {
    setIsStreaming(true);
    setTimeout(captureScreenshot, timer * 1000);
    startCountdown();
  };

  const startWebcam = () => {
    setWebcamActive(true);
  };

  const handleResetWebcam = () => {
    setIsResultReceived(false);
  };
  const handleResetExample = () => {
    setIsUserReady(false);
  };

  const sendImage = async (imageSrc: string) => {
    const accessToken = await getAccessTokenSilently();
    const data_to_send = {
      image: imageSrc,
      letter: whichLetter,
    };
    axios
      .post(import.meta.env.VITE_SIGNBUDDY_LETTER_URI, data_to_send, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setOpenLoader(false);
        console.log(res);
        const base64EncodedImage = res.data.resultImage;
        const binaryString = window.atob(base64EncodedImage);
        const imageData = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          imageData[i] = binaryString.charCodeAt(i);
        }
        const imageUrl = URL.createObjectURL(
          new Blob([imageData], { type: "image/jpeg" })
        );
        setIsLetterResults({letter: res.data.letterResult});

        setIsResultReceived(true);
        setNotifyUserResult(true);

        setResultImgSrc(imageUrl);
        setResultPredictions(res.data.resultImage);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const captureScreenshot = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setImgSrc(imageSrc);
      if (imageSrc !== null) {
        setOpenLoader(true);
        sendImage(imageSrc);
      }
      setWebcamActive(false);
      setIsStreaming(false);
    }
  };

  const startCountdown = () => {
    const countdownInterval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    setTimeout(() => {
      clearInterval(countdownInterval);
    }, timer * 1000);
  };

  useEffect(() => {
    setTimer(3); 
  }, [isWebcamActive]);

  const videoConstraints = {
    width: 512,
    height: 512,
    facingMode: "user",
    frameRate: {
      ideal: 30,
    },
  };

  const handleUserIsReady = () => {
    setIsUserReady(true);
  };

  if (isAuthenticated){
  return (
    <div>
      <ResponsiveNavbar />
      {user && (<h1 id="letterTitle">{user?.nickname}{`, you are learning letter ${whichLetter}`}</h1>)}
      <Divider
        sx={{ borderColor: "white", marginBottom: "5%" }}
        variant="middle"
      />
      {!isUserReady && (
        <Container
          disableGutters={true}
          maxWidth={false}
          sx={{
            bgcolor: "#cfe8fc",
            height: "auto",
            width: "512px",
            padding: 0,
          }}
        >
          <Card sx={{}}>
            <CardMedia
              component="img"
              alt="green iguana"
              sx={{ width: "512px", height: "512px" }}
              image={letterImgs[whichLetter]}
            />
            <CardContent sx={{}}>
              <Typography
                gutterBottom
                variant="h3"
                component="div"
                sx={{ textAlign: "center" }}
              >
                {whichLetter}
              </Typography>
              <Divider />
              <Typography
                sx={{ paddingBottom: "2%", paddingTop: "2%" }}
                variant="body2"
                color="text.secondary"
              >
                {letters[whichLetter]}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                *Note: Dont forget to face the hand towards the camera!*
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                onClick={handleUserIsReady}
                endIcon={<ThumbUpAltIcon />}
              >
                I am Ready
              </Button>
            </CardActions>
          </Card>
        </Container>
      )}
      {isUserReady && (
        <div style={{ textAlign: "center", paddingBottom: "10%" }}>
          {isWebcamActive && !isResultReceived && (
            <div
              style={{
                position: "relative",
                margin: "0 auto",
                width: "512px",
                height: "512px",
              }}
            >
              <Webcam
                audio={false}
                ref={webcamRef}
                mirrored={true}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                  ...videoConstraints,
                  frameRate: { ideal: 30, max: 60 },
                }}
                onUserMedia={onUserMedia}
                style={{
                  background: "rgba(0, 0, 0)",
                  marginTop: "10px",
                  width: "512px",
                  height: "512px",
                }}
              />
              {isStreaming && (
                <div
                  style={{
                    position: "absolute",
                    top: "10px",
                    background: "rgba(255, 255, 255, 0.7)",
                    padding: "25px",
                    borderRadius: "5px",
                    fontSize: "75px",
                    color: "green",
                  }}
                >
                  {timer}
                </div>
              )}
            </div>
          )}

          {!isWebcamActive && !isResultReceived && (
            <div
              style={{
                margin: "0 auto",
                width: "512px", // Adjust the width and height as needed
                height: "512px",
                backgroundColor: "black", // Black box as a placeholder
              }}
            ></div>
          )}

          {resultImgSrc && imgSrc && isResultReceived && (
            <div id="results">
              <h2>Results</h2>
              <Stack
                direction="row"
                spacing={6}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <Stack spacing={3}>
                  <h3>Captured Image</h3>
                  <img id="resultImg1" srcSet={imgSrc} alt="" width="256" height="256" />
                </Stack>
                <Stack spacing={3}>
                  <h3>Detection Image</h3>
                  <img id="resultImg2" srcSet={resultImgSrc} width="256" height="256" alt="" />
                </Stack>
              </Stack>
              {resultPredictions === "None" ? (
                <Stack
                  direction="row"
                  spacing={6}
                  sx={{
                    display: "flex",
                    marginTop: "2%",
                    justifyContent: "center",
                    alignContent: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <Typography
                    component="p"
                    sx={{
                      textAlign: "center",
                      width: "100%",
                      display: "block",
                    }}
                  >
                    You failed to sign the letter {whichLetter}, here are some
                    possible reasons:
                  </Typography>
                  <List>
                    <ListItem>
                      <DoNotDisturbIcon
                        sx={{ color: "red", paddingRight: "1%" }}
                      />
                      <ListItemText primary="Do not place your hand too far from the camera." />
                    </ListItem>
                    <ListItem>
                      <DoNotDisturbIcon
                        sx={{ color: "red", paddingRight: "1%" }}
                      />
                      <ListItemText primary="Do not have more than one hand in the camera." />
                    </ListItem>
                    <ListItem>
                      <DoNotDisturbIcon
                        sx={{ color: "red", paddingRight: "1%" }}
                      />
                      <ListItemText primary="Do not sign a letter very close to the edge of the camera." />
                    </ListItem>
                    <ListItem>
                      <DoNotDisturbIcon
                        sx={{ color: "red", paddingRight: "1%" }}
                      />
                      <ListItemText primary="Do not try practice in very dark lighting conditions." />
                    </ListItem>
                    <ListItem>
                      <CheckIcon sx={{ color: "green", paddingRight: "1%" }} />
                      <ListItemText primary="Do sign the letter near the center of the camera." />
                    </ListItem>
                  </List>
                </Stack>
              ) : (
                <h3>You successfully signed the letter {whichLetter}!</h3>
              )}
            </div>
          )}
          {!isResultReceived && (
            <Button
              disabled={isWebcamActive}
              variant="contained"
              size="large"
              color="success"
              onClick={startWebcam}
              sx={{ marginTop: "2%" }}
              endIcon={<SendIcon />}
            >
              Begin
            </Button>
          )}
          {isResultReceived && (
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<ReplayIcon />}
              onClick={handleResetWebcam}
              color="warning"
              size="large"
              disabled={isWebcamActive}
              sx={{ marginTop: "2%" }}
            >
              Try Again
            </Button>

          )}

          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<AssignmentIcon />}
            color="info"
            size="large"
            disabled={isWebcamActive}
            onClick={handleResetExample}
            sx={{ marginTop: "2%", marginLeft: "5%" }}
          >
            Check example
          </Button>
          
          
          {isLetterResults && (
            <div >
              <Typography variant="h4" sx={{marginTop: "5%", marginBottom: "2.5%"}}>Stats</Typography>
    
              <List sx={{display: "flex", justifyContent: "center", flexDirection: "column"}}>
              {isLetterResults.letter.completed === 1 && (
                    <ListItem >
                      <ArrowForwardIosIcon/>
                      <ListItemText  primary={`You completed letter ${whichLetter} on ${isLetterResults.letter.date_completed}`} />
                    </ListItem>
              )}

              {isLetterResults.letter.completed != 1 && (
                    <ListItem>
                      <ArrowForwardIosIcon/>
                      <ListItemText primary={`Fail Quota is: ${isLetterResults.letter.failQuota}, you have successfully signed ${isLetterResults.letter.successfulAttempts} and failed ${isLetterResults.letter.failedAttempts} `} />
                    </ListItem>
                    )}

                    <ListItem>
                    <ArrowForwardIosIcon/>
                    <ListItemText primary={`Number of attempts: ${isLetterResults.letter.totalAttempts}`} />
                    </ListItem>
                    
                    <ListItem>
                    <ArrowForwardIosIcon/>
                      <ListItemText primary={`Total Success Attempts: ${isLetterResults.letter.totalSuccessful}`} />
                    </ListItem>

                    <ListItem>
                    <ArrowForwardIosIcon/>
                      <ListItemText primary={`Total Failure Attempts: ${isLetterResults.letter.totalAttempts - isLetterResults.letter.totalSuccessful}`} />
                    </ListItem>
                  </List>
            </div>
            )}

        </div>
      )}

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openLoader}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Snackbar
        open={isNotifyUserResult}
        anchorOrigin={{ vertical, horizontal }}
        autoHideDuration={6000}
        onClose={handleNotifyUserClose}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          {`Your result for letter ${whichLetter} is ready!`}

          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleNotifyUserClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Alert>
      </Snackbar>
      <Footer></Footer>
    </div>
  );}
};

export default LearnPage;
