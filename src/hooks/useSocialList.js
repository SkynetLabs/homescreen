import { useState, useContext, useEffect } from "react";
import { SkynetContext } from "../state/SkynetContext";

// Call API and get the scores for a specfic UserID

export const useSocialList = () => {
  const { userID, socialDAC, socialList, setSocialList } = useContext(SkynetContext);
  const [followsYou, setFollowsYou] = useState(false);
  const [followingList, setFollowingList] = useState([]);
  const [currentUser, setCurrentUser] = useState("");
  const [areFollowing, setAreFollowing] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(true);

  useEffect(() => {
    if (userID & socialList) {
      if (socialList.includes(currentUser)) {
        setAreFollowing(true);
      } else {
        setAreFollowing(false);
      }
    }
  }, [userID, socialList, currentUser]);

  useEffect(() => {
    if (userID & followingList.length) {
      if (followingList.includes(userID)) {
        setFollowsYou(true);
      } else {
        setFollowsYou(false);
      }
    } else {
      setFollowsYou(false);
    }
  }, [userID, followingList]);

  const getFollowingList = async (otherUserID) => {
    // Get the list of users a user is following
    if (userID) {
      setListLoading(true);
      const followList = await socialDAC.getFollowingForUser(otherUserID);

      setCurrentUser(otherUserID);
      setFollowingList(followList);
      setListLoading(false);
    }
  };

  const followUser = async () => {
    if (userID) {
      setActionLoading(true);
      // const follow = await socialDAC.follow(currentUser);
      const list = await socialDAC.getFollowingForUser(userID);
      setSocialList(list);
      setActionLoading(false);
    }
  };

  const unfollowUser = async () => {
    if (userID) {
      setActionLoading(true);
      await socialDAC.unfollow(currentUser);
      const list = await socialDAC.getFollowingForUser(userID);
      setSocialList(list);
      setActionLoading(false);
    }
  };

  const resetFollowing = () => {
    setFollowingList([]);
    setCurrentUser("");
  };

  return [
    areFollowing,
    followsYou,
    followingList,
    getFollowingList,
    followUser,
    unfollowUser,
    resetFollowing,
    listLoading,
    actionLoading,
  ];
};
