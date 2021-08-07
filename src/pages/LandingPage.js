import HeroSection from "../components/LandingPage/HeroSection";
import ProjectsSection from "../components/LandingPage/ProjectsSection";
import DescriptionSection from "../components/LandingPage/DescriptionSection";
import SkynetSection from "../components/LandingPage/SkynetSection";
import SubscribeSection from "../components/LandingPage/SubscribeSection";
import JumbotronSection from "../components/LandingPage/JumbotronSection";
import FooterSection from "../components/LandingPage/FooterSection";

const phase = "explore"; // build, explore, dream

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      {phase === "explore" && <ProjectsSection />}
      <DescriptionSection />
      <SkynetSection />
      {phase === "build" && <SubscribeSection />}
      {phase === "explore" && <JumbotronSection />}
      <FooterSection />
    </>
  );
}
