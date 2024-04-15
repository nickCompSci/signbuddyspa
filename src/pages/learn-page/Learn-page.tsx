import Webcam from "react-webcam";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import IconButton from "@mui/material/IconButton";
import ReplayIcon from "@mui/icons-material/Replay";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import "./Learn-page.scss";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import letterDescription from "../../data/letter-descriptions.json";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from "@mui/material/Snackbar";
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
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
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
  const [isLetterResults, setIsLetterResults] = useState<{
    letter: Letter;
  } | null>(null);
  const [letterAttempt, setLetterAttempt] = useState<number>(-1);
  // const letter: string = location.state;
  const { letter, letterObject } = location.state as {
    letter: string;
    letterObject: Letter;
  };
  const { getAccessTokenSilently } = useAuth0();
  const { isAuthenticated } = useAuth0();

  const [openLoader, setOpenLoader] = useState(false);
  const handleNotifyUserClose = () => {
    setNotifyUserResult(false);
  };

  const vertical = "top";
  const horizontal = "right";

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 500); // You can adjust the threshold as needed
    };

    // Initial check on component mount
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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

  const handleBackToAlphabet = () => {
    navigate("/alphabet");
  };

  const sendImage = async (imageSrc: string) => {
    const accessToken = await getAccessTokenSilently();
    const data_to_send = {
      image: imageSrc,
      letter: letter,
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
        const base64EncodedImage = res.data.resultImage;
        const binaryString = window.atob(base64EncodedImage);
        const imageData = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          imageData[i] = binaryString.charCodeAt(i);
        }
        const imageUrl = URL.createObjectURL(
          new Blob([imageData], { type: "image/jpeg" })
        );
        setIsLetterResults({ letter: res.data.letterResult });

        setIsResultReceived(true);
        setNotifyUserResult(true);

        setResultImgSrc(imageUrl);
        setLetterAttempt(res.data.letterAttempt);
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

  if (isAuthenticated) {
    return (
      <div>
        <ResponsiveNavbar />
        {user && (
          <h1 id="letterTitle">
            {user?.nickname && user.nickname.charAt(0).toUpperCase() + user.nickname.slice(1)}
            {`, you are learning the letter ${letter}`}
          </h1>
        )}
        <Divider
          sx={{ borderColor: "white", marginBottom: "2.5%" }}
          variant="middle"
        />
        {!isUserReady && (
          <Card
            sx={
              isMobile
                ? { maxWidth: "90%", margin: "0 auto" }
                : { maxWidth: "500px", margin: "0 auto" }
            }
          >
            <CardMedia
              component="img"
              alt={`Image of letter ${letter}`}
              sx={{ width: "512px", height: "512px" }}
              image={letterImgs[letter]}
            />
            <CardContent sx={{}}>
              <Typography
                gutterBottom
                variant="h3"
                component="div"
                sx={{ textAlign: "center" }}
              >
                {letter}
              </Typography>
              <Divider />
              <Typography
                sx={{ paddingBottom: "2%", paddingTop: "2%" }}
                variant="body2"
                color="text.secondary"
              >
                {letters[letter]}
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
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<ArrowBackIcon />}
                color="info"
                onClick={handleBackToAlphabet}
              >
                Back to Alphabet
              </Button>
            </CardActions>
          </Card>
        )}
        {isUserReady && (
          <div style={{ textAlign: "center", paddingBottom: "10%" }}>
          {(!isWebcamActive && !isResultReceived && !openLoader)  && (
            <div>
            <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<ArrowBackIcon />}
            color="info"
            size="large"
            disabled={isWebcamActive || openLoader}
            onClick={handleBackToAlphabet}
            sx={{  marginBottom: "2%" }}
          >
            Back to Alphabet
          </Button>
            <Typography sx={{marginBottom: "2%"}} >
              Do not forget to face the hand towards the camera! There will be a 3 second time once you press begin.
            </Typography>
            </div>
          )}
            {isWebcamActive && !isResultReceived && (
              <div
                className="webcam_placeholder"
                style={{
                  position: "relative",
                  margin: "0 auto",
                  height: "512px",
                }}
              >
                <Webcam
                  className="webcam"
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
                className="webcam_placeholder"
                style={{
                  margin: "0 auto",
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
                  spacing={0}
                  sx={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    alignContent: "center",
                    flexWrap: "wrap",
                    margin: "0 20%",
                  }}
                >
                  <Stack spacing={3} sx={{ marginBottom: "5%" }}>
                    <h3>Captured Image</h3>
                    <img
                      id="resultImg1"
                      srcSet={imgSrc}
                      alt=""
                      width="256"
                      height="256"
                    />
                  </Stack>
                  <Stack spacing={3}>
                    <h3>Detection Image</h3>
                    <img
                      id="resultImg2"
                      srcSet={resultImgSrc}
                      width="256"
                      height="256"
                      alt=""
                    />
                  </Stack>
                </Stack>
                {letterAttempt === -1 ? (
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
                    {isLetterResults && (
                      <Typography
                        component="p"
                        sx={{
                          textAlign: "center",
                          width: "100%",
                          display: "block",
                        }}
                      >
                        You failed to sign the letter {letter} correctly for this attempt.
                        {isLetterResults.letter.completed === 1 ? (
                          ` You have passed the letter ${letter}, therefore there are no more rounds.`
                        ) : (
                          <>

                            {isLetterResults.letter.failedAttempts === 0
                              ? ` You failed ${isLetterResults.letter.failQuota} attempts in this round and therefore the round has been reset. Remember you must succeed 3 out of 5 times. Reminder:`
                              : ` If you fail the next attempt the rounds progress will be reset. You still have to succeed ${
                                  3 - isLetterResults.letter.successfulAttempts
                                } more without failing in order to pass the round.`}
                          </>
                        )}
                      </Typography>
                    )}
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
                        <CheckIcon
                          sx={{ color: "green", paddingRight: "1%" }}
                        />
                        <ListItemText primary="Do sign the letter near the center of the camera." />
                      </ListItem>
                    </List>
                  </Stack>
                ) : (
                  <div>
                    {isLetterResults && (
                      <Typography
                        component="p"
                        sx={{
                          textAlign: "center",
                          width: "100%",
                          display: "block",
                        }}
                      >
                        You signed the letter {letter} correctly for this
                        attempt.
                        {isLetterResults.letter.completed === 1
                          ? ` You have passed the letter ${letter}, therefore there are no more rounds.`
                          : ` You have succeeded ${
                              isLetterResults.letter.successfulAttempts
                            } time(s) overall in this round. You must succeed ${
                              3 - isLetterResults.letter.successfulAttempts
                            } more
                  time(s) to pass letter ${letter}, and can fail ${
                              isLetterResults.letter.failQuota -
                              isLetterResults.letter.failedAttempts
                            } time(s) or the round resets. `}
                      </Typography>
                    )}
                  </div>
                )}
              </div>
            )}
            {!isResultReceived &&  (
              <Button
                disabled={isWebcamActive || openLoader}
                variant="contained"
                size="large"
                color="success"
                onClick={startWebcam}
                sx={{ marginTop: "4%" }}
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
                disabled={isWebcamActive || openLoader}
                sx={{ marginTop: "4%" }}
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
              disabled={isWebcamActive || openLoader}
              onClick={handleResetExample}
              sx={{ marginTop: "4%", marginLeft: "5%" }}
            >
              Check example
            </Button>
            {isResultReceived && (
            <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<ArrowBackIcon />}
            color="info"
            size="large"
            disabled={isWebcamActive || openLoader}
            onClick={handleBackToAlphabet}
            sx={{  marginTop: "4%", marginLeft: "5%" }}
          >
            Back to Alphabet
          </Button>
            )}

            {isLetterResults && (
              <div>
                <Divider
                  sx={{
                    marginTop: "5%",
                    marginLeft: "10%",
                    marginRight: "10%",
                  }}
                ></Divider>
                <Stack
                  direction="row"
                  
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignContent: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      marginTop: "5%",
                      textAlign: "center",
                      width: "100%",
                      display: "block",
                    }}
                  >
                    Stats
                  </Typography>

                  <List
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      flexDirection: "column",
                    }}
                  >
                    {isLetterResults.letter.completed === 1 && (
                      <ListItem disableGutters={true}> 
                        <ArrowForwardIosIcon />
                        <ListItemText
                          primary={`You completed letter ${letter} on ${isLetterResults.letter.date_completed}`}
                        />
                      </ListItem>
                    )}

                    <ListItem disableGutters={true}>
                      <ArrowForwardIosIcon />
                      <ListItemText
                        primary={`Number of attempts: ${isLetterResults.letter.totalAttempts}`}
                      />
                    </ListItem>

                    <ListItem disableGutters={true}>
                      <ArrowForwardIosIcon />
                      <ListItemText
                        primary={`Total Success Attempts: ${isLetterResults.letter.totalSuccessful}`}
                      />
                    </ListItem>

                    <ListItem disableGutters={true}>
                      <ArrowForwardIosIcon />
                      <ListItemText
                        primary={`Total Failure Attempts: ${
                          isLetterResults.letter.totalAttempts -
                          isLetterResults.letter.totalSuccessful
                        }`}
                      />
                    </ListItem>
                  </List>
                </Stack>
              </div>
            )}
              {!isLetterResults && (
                <div>
                <Divider
                sx={{
                  marginTop: "5%",
                  marginLeft: "10%",
                  marginRight: "10%",
                }}
              ></Divider>
                <Stack
                  direction="row"
                  
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignContent: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      marginTop: "5%",
                      textAlign: "center",
                      width: "100%",
                      display: "block",
                    }}
                  >
                    Stats
                  </Typography>

                  <List
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      flexDirection: "column",
                    }}
                  >
                    {letterObject.completed === 1 && (
                      <ListItem disableGutters={true}>
                        <ArrowForwardIosIcon />
                        <ListItemText
                          primary={`You completed letter ${letter} on ${letterObject.date_completed}`}
                        />
                      </ListItem>
                    )}

                    <ListItem disableGutters={true}>
                      <ArrowForwardIosIcon />
                      <ListItemText
                        primary={`Number of attempts: ${letterObject.totalAttempts}`}
                      />
                    </ListItem>

                    <ListItem disableGutters={true}>
                      <ArrowForwardIosIcon />
                      <ListItemText
                        primary={`Total Success Attempts: ${letterObject.totalSuccessful}`}
                      />
                    </ListItem>

                    <ListItem disableGutters={true}>
                      <ArrowForwardIosIcon />
                      <ListItemText
                        primary={`Total Failure Attempts: ${
                          letterObject.totalAttempts -
                          letterObject.totalSuccessful
                        }`}
                      />
                    </ListItem>
                  </List>
                </Stack>
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
            {`Your result for letter ${letter} is ready!`}

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
    );
  }
};

export default LearnPage;
