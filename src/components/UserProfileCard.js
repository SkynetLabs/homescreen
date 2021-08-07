import { useContext, useState, useEffect } from "react";
import { SkynetContext } from "../state/SkynetContext";
import { useAvatar } from "../hooks/useAvatar";
import { useScores } from "../hooks/useScores";
import AvatarIcon from "./AvatarIcon";
import GlowingPointer from "./GlowingPointer";
import Link from "./Link";

const UserProfileCard = () => {
  const { userID, profile, client } = useContext(SkynetContext);
  // const [loading, setLoading] = useState(true);
  const [avatar] = useAvatar();
  const [scores] = useScores();
  const [skyProfileUrl, setSkyProfileUrl] = useState("https://skyprofile.hns.siasky.net");

  useEffect(() => {
    const initSkyProfileUrl = async () => {
      const url = await client.getHnsUrl("skyprofile", { subdomain: true });
      setSkyProfileUrl(url);
    };

    if (client) {
      initSkyProfileUrl();
    }
  }, [client]);

  // const handleSignUp = () => {
  //   console.log("Do Signup. After signup, we should be able to search and get a hit, even with 0 interactions.");
  // };

  // useEffect(() => {
  //   setLoading(true);
  //   // resetScores();
  //   // if (profile) {
  //   //   // getAvatar(profile);
  //   //   getScores(userID);
  //   // }
  //   setLoading(false);
  // }, [userID, profile]);
  // }, [profile, getAvatar, getScores, resetScores]);

  // console.log("card profile", profile);

  return (
    <div className="w-full">
      {!userID && (
        <>
          <GlowingPointer direction="down" />
          {/* <div className="bg-green-100 shadow p-4 rounded w-full">
            <div className="text-center mt-4">
              <p className="text-gray-600 font-bold">Welcome!</p>
              <p className="text-sm font-thin text-gray-600 mt-1 mb-2">Login or create a MySky Account below.</p>
              <div className="w-12 text-gray-500 mx-auto">
                <ArrowCircleDownIcon className="text-xs text-primary animate-bounce" />
              </div>
            </div>
          </div> */}
          {/* <div className="w-full px-4 animate-pulse">
            <div className="w-16 text-gray-500 mx-auto filter blur-xl -my-16 z-0">
              <ArrowCircleDownIcon className="text-primary" />
            </div>
            <div className="w-16 text-gray-500 mx-auto z-40">
              <ArrowCircleDownIcon className="text-primary" />
            </div>
          </div> */}
        </>
      )}
      {userID && !avatar && (
        <div className="bg-gray-200 shadow p-4 rounded w-full mb-8 block">
          <div className="text-center mt-2">
            <p className="text-gray-600 font-bold mb-1">Need a Profile?</p>
            <span className="font-semibold">
              {/* <Link href="https://skyprofile.hns.siasky.net">Try SkyProfile!</Link> */}
              <Link href={skyProfileUrl}>Try SkyProfile!</Link>
            </span>
            <p className="text-sm font-thin text-gray-600 mt-1 mb-2">
              Be sure to include contact info to recieve prizes.
            </p>
          </div>
        </div>
      )}
      {userID && profile && (
        <div className="bg-white shadow p-4 rounded w-full">
          <div className="text-center mt-4">
            {profile.username && <p className="text-gray-600 font-bold">{profile.username}</p>}
            {(profile.firstName || profile.lastname) && (
              <p className="text-sm font-hairline text-gray-600 mt-1">{profile.firstName + " " + profile.lastName}</p>
            )}
            <p className="text-xs font-hairline text-gray-600 mt-1 break-all">
              <Link to={"/leaderboard/users/" + userID} className="text-gray-600">
                {userID}
              </Link>
            </p>
          </div>
          {avatar && (
            <div className="flex justify-center mt-4">
              <AvatarIcon avatar={avatar} />
            </div>
          )}
          {scores && (
            <div className="mt-6 flex justify-between text-center">
              <div>
                <p className="text-gray-700 font-bold">{scores.interactionsTotal}</p>
                <p className="text-xs mt-2 text-gray-600 font-hairline">Interactions</p>
              </div>
              <div>
                <p className="text-gray-700 font-bold">{scores.newContentTotal}</p>
                <p className="text-xs mt-2 text-gray-600 font-hairline">Creations</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfileCard;
