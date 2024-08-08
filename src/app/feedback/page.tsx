"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { TextInput, Textarea, Button } from "@/components/base/Input";
import { GitHub } from "react-feather";

const loginURI = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&redirect_uri=https://${process.env.NEXT_PUBLIC_URL}/api/auth`;
const maxMessageLength = 250;

export default function Feedback() {
  const router = useRouter();
  const params = useSearchParams();

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loadingState, setLoadingState] = useState<
    "authenticating" | "sending" | false
  >(false);

  function authorize(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

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

  return (
    <section
      onSubmit={authorize}
      className="-my-20 grid min-h-[calc(100vh-103px)] place-items-center"
    >
      <div className="grid grid-cols-2 gap-20">
        <div className="flex flex-col gap-10 text-text-dark">
          <h1 className="h1">What do you think?</h1>
          <p className="h3">
            Log in to leave some feedback on my portfolio. Your name, comment,
            and profile picture will be visible to other visitors.
          </p>
        </div>
        <form className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <label htmlFor="name" className="h3">
              Name
            </label>
            <TextInput
              id="name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-4">
            <label htmlFor="message" className="h3">
              Message
            </label>
            <div className="relative">
              <Textarea
                maxLength={maxMessageLength}
                id="message"
                placeholder="Your message..."
                className="w-full !resize-none"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
              {message.length === maxMessageLength && (
                <span className="span absolute bottom-3 right-5 text-red-500">
                  Character limit reached.
                </span>
              )}
            </div>
          </div>
          <Button type="submit" theme="dark" disabled={!!loadingState}>
            {loadingState === "authenticating" ? (
              "Authenticating..."
            ) : loadingState === "sending" ? (
              "Sending..."
            ) : (
              <>
                <GitHub size={16} />
                Send with GitHub
              </>
            )}
          </Button>
        </form>
      </div>
    </section>
  );
}
