"use client";

import { useState } from "react";

import { GitHub } from "react-feather";

const loginURI = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_URL}/api/auth`;

export default function FeedbackPopup({
  onSubmit,
  onCancel,
  className,
}: {
  onSubmit: (name: string, message: string) => void;
  onCancel: () => void;
  className?: string;
}) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  return (
    <form
      onSubmit={() => onSubmit(name, message)}
      className={`flex w-full max-w-96 flex-col gap-6 rounded-xl border border-card-light-border bg-card-light p-6 text-sm dark:border-card-dark-border dark:bg-card-dark ${className}`}
    >
      <hgroup className="flex flex-col gap-0.5">
        <h2 className="text-2xl font-medium">What do you think?</h2>
        <p className="text-text-light/75 dark:text-text-dark/75">
          Log in to leave some feedback on my portfolio.
        </p>
      </hgroup>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label className="font-medium" htmlFor="name">
            Name
          </label>
          <input
            className="rounded border border-card-light-border p-2 placeholder:text-text-light/25 focus:outline-none focus:ring-2 dark:border-card-dark-border dark:placeholder:text-text-dark/25"
            id="name"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-medium" htmlFor="message">
            Message
          </label>
          <textarea
            className="h-24 resize-none rounded border border-card-light-border p-2 placeholder:text-text-light/25 focus:outline-none focus:ring-2 dark:border-card-dark-border dark:placeholder:text-text-dark/25"
            id="message"
            placeholder="Your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={250}
          />
        </div>
      </div>
      <div className="mt-1 flex flex-col gap-3">
        <a className="w-full" href={loginURI}>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-3 rounded-md bg-text-light p-[14px] font-medium text-white transition-transform hover:translate-y-0.5 dark:bg-text-dark dark:text-text-light"
          >
            <GitHub size={16} />
            <span>Send with GitHub</span>
          </button>
        </a>
        <button
          type="button"
          className="rounded-md border border-card-light-border p-3 text-center transition-transform hover:translate-y-0.5 dark:border-card-dark-border"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
