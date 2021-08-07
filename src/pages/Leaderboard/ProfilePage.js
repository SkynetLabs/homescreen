import { useEffect, useContext } from "react";
import { SkynetContext } from "../../state/SkynetContext";
import { useState } from "react";
import ProfileEditor from "../../components/ProfileEditor";

export default function ProfilePage({ setTitle }) {
  const { userID, profile } = useContext(SkynetContext);
  const [loading, setLoading] = useState(false);
  const [, setEmptyProfile] = useState(true);

  useEffect(() => {
    setTitle("MySky Profile");
  }, [setTitle]);

  useEffect(() => {
    setLoading(true);
    if (profile) {
      const { aboutMe, avatar, username } = profile;

      if (!aboutMe && !avatar && !username) {
        setEmptyProfile(true);
      } else {
        setEmptyProfile(false);
      }
    } else {
      setEmptyProfile(true);
    }
    setLoading(false);
  }, [profile]);

  return (
    <div className="space-y-4">
      {loading && "Loading..."}
      {/* {!loading && !userID && <CreateAccountInstructions />} */}
      {!loading && userID && !profile && <ProfileEditor firstTime={true} />}
      {!loading && userID && profile && <ProfileEditor firstTime={false} />}
    </div>
  );
}
