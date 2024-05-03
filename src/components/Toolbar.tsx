"use client";

import { useState } from "react";

import { MessageCircle, GitHub } from "react-feather";
import DarkModeToggle from "./DarkModeToggle";
import FeedbackPopup from "./FeedbackPopup";

function ToolbarItem({ children }: { children: React.ReactNode }) {
  return <li className="grid h-12 w-12 place-items-center">{children}</li>;
}

export default function Toolbar() {
  const [feedbackPopupVisible, setFeedbackPopupVisible] = useState(false);

  return (
    <>
      <ul className="border-card-light-border collision dark:border-card-dark-border fixed bottom-8 flex rounded-full border bg-card-light opacity-50 transition-opacity hover:opacity-100 dark:bg-card-dark sm:bottom-12">
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
        className={`${feedbackPopupVisible ? "opacity-100 backdrop-blur-lg" : "pointer-events-none opacity-0 backdrop-blur-none"} fixed inset-0 z-50 grid h-screen w-screen place-items-center bg-white/10 transition-all duration-300 ease-out dark:bg-text-light/10`}
      >
        <FeedbackPopup
          onSubmit={(name, message) => {
            console.log(name, message);
          }}
          onCancel={() => setFeedbackPopupVisible(false)}
        />
      </div>
    </>
  );
}
