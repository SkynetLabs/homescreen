import { useState, useEffect, useContext } from "react";
import { SkynetContext } from "../state/SkynetContext";

// Call API and get the scores for a specfic UserID

export const useUserContent = () => {
  const [userContent, setUserContent] = useState();
  const { userID } = useContext(SkynetContext);

  useEffect(() => {
    const getUserContent = async () => {
      const r = await returnUserContent(userID);
      if (r) {
        setUserContent(r);
      }
    };

    if (userID) {
      getUserContent();
    }
  }, [userID, setUserContent]);

  return [userContent];
};

export const returnUserContent = async (userID) => {
  if (userID) {
    const response = await fetch("https://dev1.siasky.dev/leaderboard/usercontent?userPK=" + userID);
    const json = await response.json();
    if (json) {
      return json;
    }
  } else {
    return null;
  }
};
