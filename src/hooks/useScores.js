import { useState, useEffect, useContext } from "react";
import { SkynetContext } from "../state/SkynetContext";

// Call API and get the scores for a specfic UserID

export const useScores = () => {
  const [scores, setScores] = useState();
  const { userID } = useContext(SkynetContext);

  useEffect(() => {
    const getScores = async () => {
      const s = await returnScores(userID);
      if (s) {
        setScores(s);
      }
    };

    if (userID) {
      getScores();
    }
  }, [userID, setScores]);

  // const getScores = async (userID) => {
  //   fetch("https://dev1.siasky.dev/leaderboard/users?userPK=" + userID)
  //     .then((response) => {
  //       return response.json();
  //     })
  //     .then((data) => {
  //       if (data) {
  //         setScores(data[0]);
  //       }
  //     });
  // };

  // const resetScores = () => {
  //   setScores();
  // };

  return [scores];
};

export const returnScores = async (userID) => {
  if (userID) {
    const response = await fetch("https://dev1.siasky.dev/leaderboard/users?userPK=" + userID);
    const json = await response.json();
    if (json) {
      return json[0];
    }
  } else {
    return null;
  }

  // .then((response) => {
  //   return response.json();
  // })
  // .then((data) => {
  //   if (data) {
  //     setScores(data[0]);
  //   }
  // });
};
