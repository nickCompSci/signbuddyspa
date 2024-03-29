import "./scss/style.scss"
import { feature1, feature2, feature3, feature4 } from "../../assets/images";
import SignLanguageIcon from '@mui/icons-material/SignLanguage';
import Stack from '@mui/material/Stack';

import LoginButton from "../../components/login/login-button";
import { SignupButton } from "../../components/registration/registration-button";
import Footer from "../../components/footer/footer";
const LandingPage = () => {


  return (
<div className="body-wrap">
<header className="site-header">
    <div className="container">
        <div className="site-header-inner">
            <div className="brand header-brand">
                <h1 className="m-0">
      <a href="#">
        <SignLanguageIcon sx={{color: "lightblue" }}/>
                    </a>
                </h1>
            </div>
        </div>
    </div>
</header>

<main>
    <section className="hero">
        <div className="container">
            <div className="hero-inner">
    <div className="hero-copy">
                  <h1 className="hero-title mt-0">SignBuddy</h1>
                  <p className="hero-paragraph">Learn and practice American Sign Language <i>letters</i> and verify with Machine Learning.</p>
                  <Stack direction="row" spacing={4} className="hero-cta"><LoginButton></LoginButton><SignupButton></SignupButton></Stack>
    </div>
    <div className="hero-figure anime-element">
      <svg className="placeholder" width="528" height="396" viewBox="0 0 528 396">
        <rect width="528" height="396" style={{fill:"transparent"}} />
      </svg>
      <div className="hero-figure-box hero-figure-box-01" data-rotation="45deg"></div>
      <div className="hero-figure-box hero-figure-box-02" data-rotation="-45deg"></div>
      <div className="hero-figure-box hero-figure-box-03" data-rotation="0deg"></div>
      <div className="hero-figure-box hero-figure-box-04" data-rotation="-135deg"></div>
      <div className="hero-figure-box hero-figure-box-05"></div>
      <div className="hero-figure-box hero-figure-box-06"></div>
      <div className="hero-figure-box hero-figure-box-07"></div>
      <div className="hero-figure-box hero-figure-box-08" data-rotation="-22deg"></div>
      <div className="hero-figure-box hero-figure-box-09" data-rotation="-52deg"></div>
      <div className="hero-figure-box hero-figure-box-10" data-rotation="-50deg"></div>
    </div>
            </div>
        </div>
    </section>

    <section className="features section">
        <div className="container">
  <div className="features-inner section-inner has-bottom-divider">
                <div className="features-wrap">
                    <div className="feature text-center is-revealing">
                        <div className="feature-inner">
                            <div className="feature-icon">
            <img srcSet={feature1} alt="Feature 01"/>
                            </div>
                            <h4 className="feature-title mt-24">Learn</h4>
                            <p className="text-sm mb-0">Learn the 26 letters of the ASL alphabet at your own pace and with no restrictions.</p>
                        </div>
                    </div>
      <div className="feature text-center is-revealing">
                        <div className="feature-inner">
                            <div className="feature-icon">
            <img srcSet={feature2} alt="Feature 02"/>
                            </div>
                            <h4 className="feature-title mt-24">Practice</h4>
                            <p className="text-sm mb-0">Be able to continuously practice signing letters and verify your signing via machine learning!</p>
                        </div>
                    </div>
                    <div className="feature text-center is-revealing">
                        <div className="feature-inner">
                            <div className="feature-icon">
            <img srcSet={feature3} alt="Feature 03"/>
                            </div>
                            <h4 className="feature-title mt-24">Machine Learning</h4>
                            <p className="text-sm mb-0">Each attempt at a ASL letter is verified by a state of the art Object Detection Model, trained on thousands of images.</p>
                        </div>
                    </div>
                    <div className="feature text-center is-revealing">
                        <div className="feature-inner">
                            <div className="feature-icon">
            <img srcSet={feature4} alt="Feature 04"/>
                            </div>
                            <h4 className="feature-title mt-24">Progress</h4>
                            <p className="text-sm mb-0">Track your progress for each letter and reach 100% ASL alphabet completion.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section className="pricing section">
        <div className="container-sm">
            <div className="pricing-inner section-inner">
                <div className="pricing-header text-center">
                    <h2 className="section-title mt-0">Benefits for all</h2>
                    <p className="section-paragraph mb-0">The worlds deaf population is growing, learning a sign language helps the deaf and the non-deaf to be able to communicate together!</p>
                </div>
            </div>
        </div>
    </section>


</main>

<Footer></Footer>
</div>

)}

export default LandingPage;