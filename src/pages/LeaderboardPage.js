import { useState } from "react";
import { Switch, Route } from "react-router-dom";
import { MenuIcon } from "@heroicons/react/outline";
import SkappPage from "./Leaderboard/SkappPageFull";
import ContentPage from "./Leaderboard/ContentPage";
import UserPage from "./Leaderboard/UserPage";
import SingleUserPage from "./Leaderboard/SingleUserPage";
import SideBar from "./Leaderboard/SideBar";
import ProfilePage from "./Leaderboard/ProfilePage";
import PrizesPage from "./Leaderboard/PrizesPage";

export default function LeaderboardPage({ ...props }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [title, setTitle] = useState("Dashboard");

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="lg:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
          <button
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="py-4">
                <Switch>
                  <Route exact path="/leaderboard">
                    <SkappPage setTitle={setTitle} />
                  </Route>
                  <Route path="/leaderboard/content">
                    <ContentPage setTitle={setTitle} />
                  </Route>
                  <Route path="/leaderboard/users/:showID">
                    <SingleUserPage setTitle={setTitle} />
                  </Route>
                  <Route path="/leaderboard/users">
                    <UserPage setTitle={setTitle} />
                  </Route>
                  <Route path="/leaderboard/profile">
                    <ProfilePage setTitle={setTitle} />
                  </Route>
                  <Route path="/leaderboard/prizes">
                    <PrizesPage setTitle={setTitle} />
                  </Route>
                </Switch>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
