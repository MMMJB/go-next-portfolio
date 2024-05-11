"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { MessageCircle, GitHub } from "react-feather";
import DarkModeToggle from "./DarkModeToggle";
import FeedbackPopup from "./FeedbackPopup";

function ToolbarItem({ children }: { children: React.ReactNode }) {
  return <li className="grid h-12 w-12 place-items-center">{children}</li>;
}

export default function Toolbar() {
  const params = useSearchParams();

  const [feedbackPopupVisible, setFeedbackPopupVisible] = useState(false);

  useEffect(() => {
    if (params.has("access_token") && window.localStorage.getItem("feedback")) {
      setFeedbackPopupVisible(true);
    }
  }, []);

  return (
    <>
      <ul className="collision fixed bottom-8 left-1/2 flex -translate-x-1/2 rounded-full border border-card-light-border bg-card-light dark:border-card-dark-border dark:bg-card-dark sm:bottom-12">
        <ToolbarItem>
          <a target="_blank" href="https://github.com/MMMJB/go-next-portfolio">
            <GitHub size={20} />
          </a>
        </ToolbarItem>
        <ToolbarItem>
          <button
            onClick={() => setFeedbackPopupVisible(true)}
            className="animate-wave"
          >
            <MessageCircle size={20} />
          </button>
        </ToolbarItem>
        <ToolbarItem>
          <DarkModeToggle />
        </ToolbarItem>
      </ul>
      <div
        className={`${feedbackPopupVisible ? "opacity-100 backdrop-blur-lg" : "pointer-events-none opacity-0 backdrop-blur-none"} fixed inset-0 z-50 grid w-screen place-items-center bg-white/10 p-8 transition-all duration-300 ease-out dark:bg-text-light/10`}
      >
        <FeedbackPopup onCancel={() => setFeedbackPopupVisible(false)} />
      </div>
    </>
  );
}
