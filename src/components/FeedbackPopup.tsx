"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { GitHub } from "react-feather";

const loginURI = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&redirect_uri=https://${process.env.NEXT_PUBLIC_URL}/api/auth`;
const maxMessageLength = 250;

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

    if (!name || !message || !avatar || !email) return;

    const res = await fetch(
      `/api/newVisitor?name=${name}&message=${message.substring(0, maxMessageLength)}&avatar=${avatar}&email=${email}`,
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

  return <h1>Feedback</h1>;
}
