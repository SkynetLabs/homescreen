import { useState, useContext } from "react";
import { SkynetContext } from "../state/SkynetContext";

// derives an avatar URL from a profile object
// Right now this isn't standardized:
// - if string it's a SkyID skyfile that is a folder, we'll grab 150x150 image
// - if its an object with url that skyfile is the avatar
// - (haven't setup) it matches skystandards, this might be 3rd option
// - else, set avatar to null

const prizeGiverUserID = "12ac371a9f55a83b49a19624d1ddd0e81d74d31f9e3aa63d2b89ed02652858af";

export const usePrizes = () => {
  const [wonPrizes, setWonPrizes] = useState([]);
  const { client, userID } = useContext(SkynetContext);

  const getPrizes = async () => {
    if (userID) {
      const path = "skynet-hackathon.hns/" + userID + "/prizes.json";
      const { data } = await client.file.getJSON(prizeGiverUserID, path);
      if (data.prizes) {
        setWonPrizes(data.prizes);
      } else {
        setWonPrizes([]);
      }
    } else {
      setWonPrizes([]);
    }
  };

  return [wonPrizes, getPrizes];
};
