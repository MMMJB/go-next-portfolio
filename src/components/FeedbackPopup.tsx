"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { GitHub } from "react-feather";
import Loader from "./Loader";

import getTheme from "@/utils/getTheme";

const loginURI = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_URL}/api/auth`;

export default function FeedbackPopup({
  onCancel,
  className,
}: {
  onCancel: () => void;
  className?: string;
}) {
  const router = useRouter();
  const params = useSearchParams();

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loadingState, setLoadingState] = useState<
    "authenticating" | "sending" | false
  >(false);

  function authorize() {
    if (name === "" || message === "" || loadingState) return;

    window.localStorage.setItem("feedback", JSON.stringify({ name, message }));

    setLoadingState("authenticating");
    router.push(loginURI);
  }

  async function getUserData(token: string) {
    const res = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `token ${token}`,
      },
    });

    const data = await res.json();

    return data as GithubUser;
  }

  async function addVisitor(name: string, message: string, user: GithubUser) {
    const avatar = user.avatar_url;
    const email = user.email || `g${user.id}`;

    const res = await fetch(
      `/api/newVisitor?name=${name}&message=${message}&avatar=${avatar}&email=${email}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (res.ok) {
      window.localStorage.removeItem("feedback");
      window.location.href = "/";
    } else {
      console.error(`Failed to add visitor: ${res.statusText}`);
    }

    setLoadingState(false);
  }

  useEffect(() => {
    const existingFeedback = window.localStorage.getItem("feedback");
    const token = params.get("access_token");

    if (existingFeedback) {
      const { name, message } = JSON.parse(existingFeedback);
      setName(name);
      setMessage(message);

      if (token) {
        setLoadingState("sending");

        getUserData(token).then((user) => addVisitor(name, message, user));
      }
    }
  }, []);

  return (
    <form
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
        <button
          type="button"
          onClick={authorize}
          className="flex w-full items-center justify-center gap-3 rounded-md bg-text-light p-[14px] font-medium text-white transition-all disabled:cursor-not-allowed disabled:opacity-50 dark:bg-text-dark dark:text-text-light [&:not(:disabled)]:hover:translate-y-0.5"
          disabled={!!loadingState}
        >
          {!loadingState ? (
            <GitHub size={16} />
          ) : (
            <Loader
              size="sm"
              color={getTheme() === "light" ? "white" : "#353A56"}
            />
          )}
          <span>
            {loadingState === "authenticating"
              ? "Authenticating..."
              : loadingState === "sending"
                ? "Sending..."
                : "Send with GitHub"}
          </span>
        </button>
        <button
          type="button"
          className="rounded-md border border-card-light-border p-3 text-center transition-all disabled:cursor-not-allowed disabled:opacity-50 dark:border-card-dark-border [&:not(:disabled)]:hover:translate-y-0.5"
          onClick={onCancel}
          disabled={!!loadingState}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
