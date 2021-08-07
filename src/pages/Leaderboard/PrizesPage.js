import { useEffect, useContext } from "react";
// import { UserCircleIcon } from "@heroicons/react/solid";
// import Tag from "../../components/Tag";
import { SkynetContext } from "../../state/SkynetContext";
import { usePrizes } from "../../hooks/usePrizes";

export default function SingleUserPage({ setTitle }) {
  const { userID } = useContext(SkynetContext);
  // const [loading, setLoading] = useState(true);
  const [prizes] = usePrizes();

  useEffect(() => {
    // getPrizes(userID);
  }, [userID]);

  useEffect(() => {
    setTitle("Prizes Page");
  }, [setTitle]);

  return (
    <main class="prizes-page">
      <section class="relative py-16">
        <div class="container mx-auto px-4">
          <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg">
            <div>Prize Header</div>
            <div>Prize Cards</div>
            <div>Prize Instructions</div>
          </div>
          {userID && (
            <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg">
              <div>Won Prizes Header</div>
              <div>
                {prizes.map((prize, i) => {
                  return <li key={i}>{prize.prize}</li>;
                })}
              </div>
              <div>CTA on setting profile/social info to redeem your prize!</div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
