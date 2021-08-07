import React, { useEffect } from "react";
import SkappPage from "./SkappPage";
import SkappPageTop from "../../components/SkappPageTop";

export default function ContentPage({ setTitle }) {
  useEffect(() => {
    setTitle("");
  }, [setTitle]);

  return (
    <div className="space-y-4">
      <SkappPageTop />
      <SkappPage />
    </div>
  );
}
