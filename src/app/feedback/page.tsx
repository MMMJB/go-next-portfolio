import { TextInput, Textarea, Button } from "@/components/base/Input";
import { GitHub } from "react-feather";

export default function Feedback() {
  return (
    <section className="-my-20 grid min-h-[calc(100vh-103px)] place-items-center">
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
            <TextInput id="name" placeholder="Your name" />
          </div>
          <div className="flex flex-col gap-4">
            <label htmlFor="message" className="h3">
              Message
            </label>
            <Textarea id="message" placeholder="Your message..." />
          </div>
          <Button type="submit" theme="dark">
            <GitHub size={16} />
            Send with GitHub
          </Button>
        </form>
      </div>
    </section>
  );
}
