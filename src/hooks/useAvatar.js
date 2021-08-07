import { useState, useEffect, useContext } from "react";
import { client, SkynetContext } from "../state/SkynetContext";

// derives an avatar URL from a profile object
// Right now this isn't standardized:
// - if string it's a SkyID skyfile that is a folder, we'll grab 150x150 image
// - if its an object with url that skyfile is the avatar
// - if it's an object with array
// - (haven't setup) it matches skystandards, this might be 3rd option
// - else, set avatar to null

export const useAvatar = () => {
  const [avatar, setAvatar] = useState("");
  const { profile } = useContext(SkynetContext);

  useEffect(() => {
    const getAvatar = async () => {
      const a = await returnAvatar(profile);
      setAvatar(a);
    };

    if (profile) {
      getAvatar();
    } else {
      setAvatar("");
    }
  }, [profile, setAvatar]);

  return [avatar];
};

export const returnAvatar = async (profile) => {
  if (profile && "avatar" in profile) {
    if (typeof profile.avatar === "string") {
      const a = await client.getSkylinkUrl(profile.avatar);
      return a + "/150";
    } else if ("url" in profile.avatar) {
      const avatarUrl = await client.getSkylinkUrl(profile.avatar.url);
      return avatarUrl;
    } else if (profile.avatar[0] && profile.avatar[0].url) {
      const avatarUrl = await client.getSkylinkUrl(profile.avatar[0].url);
      return avatarUrl;
    } else {
      return "";
    }
  } else {
    return "";
  }
};
