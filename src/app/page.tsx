import Social from "@/components/Social";
import { Linkedin, Instagram, GitHub, Mail } from "react-feather";

export default function Home() {
  return (
    <>
      <section className="flex flex-col gap-16">
        <header className="grid grid-cols-2 gap-8">
          <h1 className="h1 text-text-dark">Michael Beck Developer</h1>
          <div className="flex flex-col justify-center gap-4">
            <p className="h3">
              I&rsquo;m a 17-year-old experienced in web dev and UI/UX.
              I&rsquo;m the founder of Launch and a frontend developer at a few
              other projects. If you&rsquo;d like to chat, feel free to contact
              me.
            </p>
            <div className="flex gap-3">
              <Social circular link="https://www.linkedin.com/in/michaelbeck0/">
                <Linkedin />
              </Social>
              <Social circular link="https://www.instagram.com/michael0beck/">
                <Instagram />
              </Social>
              <Social circular link="https://github.com/MMMJB">
                <GitHub />
              </Social>
              <Social circular link="mailto:beck.jacob.michael@gmail.com">
                <Mail />
              </Social>
            </div>
          </div>
        </header>
        <img src="/waves.png" alt="" />
      </section>
      <section className="flex flex-col gap-10">
        <h1 className="h3 text-text-dark">Work</h1>
        <div className="grid grid-cols-2 gap-5"></div>
      </section>
      <section className="flex flex-col gap-10">
        <h1 className="h3 text-text-dark">Featured projects</h1>
        <div className="grid grid-cols-2 gap-5"></div>
      </section>
    </>
  );
}
