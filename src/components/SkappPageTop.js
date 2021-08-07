import React, { useEffect, useContext, useState, useMemo } from "react";
import { client, SkynetContext } from "../state/SkynetContext";
import { useAvatar } from "../hooks/useAvatar";
import { Header1, Header3, Subheader, Paragraph } from "./Typography";
import ProgressSteps from "./ProgressSteps";
import Link from "./Link";

const getStepStatus = (currentStep, step) => {
  if (currentStep > step) return "complete";
  if (currentStep === step) return "current";
  return "upcoming";
};

export default function SkappPageTop() {
  const { userID, mySky, setUserID } = useContext(SkynetContext);
  const [avatar] = useAvatar();
  const [currentStep, setCurrentStep] = useState(1);
  const steps = useMemo(
    () => [
      {
        id: 1,
        name: "Login with MySky",
        description: "Create a new decentralized login for all of Skynet",
        status: getStepStatus(currentStep, 1),
        onClick: () => {
          mySky.requestLoginAccess().then((result) => {
            if (result) {
              mySky.userID().then(setUserID);
            }
          });
        },
      },
      {
        id: 2,
        name: "Create a Profile",
        description: "Add a username, avatar and contact info to receive prizes",
        status: getStepStatus(currentStep, 2),
        onClick: () => {
          // window.open("https://skyprofile.hns.siasky.net", "_blank");
          client.openFileHns("skyprofile", { subdomain: true });
        },
      },
      {
        id: 3,
        name: "Explore & Create",
        description: "Use apps to rank up on the Leaderboard",
        status: getStepStatus(currentStep, 3),
      },
    ],
    [mySky, setUserID, currentStep]
  );

  useEffect(() => {
    if (userID && avatar) {
      setCurrentStep(3);
    } else if (userID) {
      setCurrentStep(2);
    } else {
      setCurrentStep(1);
    }
  }, [userID, avatar, setCurrentStep]);

  return (
    <div className="space-y-4">
      <div className="inline-block pr-10 pb-1 border-b-8 border-primary-light mb-10">
        <Header1>Welcome Explorers</Header1>
      </div>
      {/* <div className="bg-white px-6 py-6 rounded shadow"> */}
      <div className="pb-6">
        <ProgressSteps steps={steps} currentStep={currentStep} />
      </div>
      <Divider />
      <div className="py-6 text-center">
        <Subheader>
          Have questions? Want to chat with other Explorers?{" "}
          <Link href="https://discord.gg/skynetlabs">Join our Discord.</Link>
        </Subheader>
      </div>
      <Divider />
      {/* <Header3>Step {step}</Header3>
      <div>
        <MySkyButton />
      </div>
      <Paragraph>
        <p className="py-3">
          Look for the MySky Login button . Your data will be public, discoverable, and usable by other apps!
        </p>
      </Paragraph>

      <Divider /> */}
      <div className="pt-6 pb-2">
        <Header3>Check out the Builder Apps</Header3>
        <div className="pt-2">
          <Paragraph>
            Look for the MySky Login button and make some things. Your data will be public, discoverable, and usable by
            other apps!
          </Paragraph>
        </div>
      </div>
    </div>
  );
}

const Divider = () => {
  return (
    <div className="w-100 py-4">
      <div className="w-1/2 border-gray-300 border-b-2 mx-auto" />
    </div>
  );
};
