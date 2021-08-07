import { useState, useEffect } from "react";
import { returnAvatar } from "./useAvatar";
import { returnScores } from "./useScores";
// import { returnUserContent } from "./useUserContent";

const emptyScores = {
  interactionsLast24H: null,
  interactionsTotal: null,
  newContentLast24H: null,
  newContentTotal: null,
  rank: null,
  userPK: "",
};

export const useProfile = () => {
  const [avatar, setAvatar] = useState();
  const [id, setID] = useState("");
  const [singleUserProfile, setSingleUserProfile] = useState({});
  const [singleUserScores, setSingleUserScores] = useState(emptyScores);
  // const [singleUserContent, setSingleUserContent] = useState([]);

  // const fetchAvatar = useCallback(async (profile) => {
  //   const a = await returnAvatar(profile);
  //   console.log("fetched: ", a);
  //   setAvatar(a);
  // });

  // const fetchScores = useCallback(async (userID) => {

  // const s = await returnScores(userID);
  // if (s) {
  //   // grab scores for return
  //   const {
  //     interactionsLast24H,
  //     interactionsTotal,
  //     newContentLast24H,
  //     newContentTotal,
  //     rank,
  //     userPK,
  //     userMetadata,
  //   } = s;
  //   setSingleUserScores({ interactionsLast24H, interactionsTotal, newContentLast24H, newContentTotal, rank, userPK });
  //   if (userMetadata.mySkyProfile) {
  //     fetchAvatar(userMetadata.mySkyProfile.profile);
  //     setSingleUserProfile(userMetadata.mySkyProfile.profile);
  //   }
  // } else {
  //   setSingleUserScores({});
  // }
  // });

  useEffect(() => {
    const getProfile = async (id) => {
      const [scores, profile, avatar] = await getScores(id);
      setAvatar(avatar);
      setSingleUserProfile(profile);
      setSingleUserScores(scores);
      // const [content] = await getUserContent(id);
      // setSingleUserContent(userContent);
    };

    if (id) {
      getProfile(id);
    }
  }, [id]);

  return [singleUserProfile, singleUserScores, avatar, setID];
};

const getScores = async (userID) => {
  const s = await returnScores(userID);
  if (s) {
    // grab scores for return
    const { interactionsLast24H, interactionsTotal, newContentLast24H, newContentTotal, rank, userPK, userMetadata } =
      s;

    const singleUserScores = {
      interactionsLast24H,
      interactionsTotal,
      newContentLast24H,
      newContentTotal,
      rank,
      userPK,
    };
    // setSingleUserScores({ interactionsLast24H, interactionsTotal, newContentLast24H, newContentTotal, rank, userPK });
    if (userMetadata.mySkyProfile) {
      // fetchAvatar(userMetadata.mySkyProfile.profile);
      const avatar = await getAvatar(userMetadata.mySkyProfile.profile);
      // const userContent = await getUserContent(userID);
      // setSingleUserProfile(userMetadata.mySkyProfile.profile);
      // setSingleUserProfile(userMetadata.mySkyProfile.profile);
      return [singleUserScores, userMetadata.mySkyProfile.profile, avatar];
    } else {
      return [singleUserScores, {}, ""];
    }
  }
  return [emptyScores, {}, ""];
};

const getAvatar = async (profile) => {
  const a = await returnAvatar(profile);
  // console.log("fetched: ", a);
  // setAvatar(a);
  return a;
};
