import { MessageCircle, GitHub } from "react-feather";
import DarkModeToggle from "./DarkModeToggle";

function ToolbarItem({ children }: { children: React.ReactNode }) {
  return <li className="grid h-12 w-12 place-items-center">{children}</li>;
}

export default function Toolbar() {
  return (
    <ul className="border-card-light-border collision dark:border-card-dark-border fixed bottom-8 flex rounded-full border bg-card-light opacity-50 transition-opacity hover:opacity-100 dark:bg-card-dark sm:bottom-12">
      <ToolbarItem>
        <a href="https://github.com/MMMJB/go-next-portfolio">
          <GitHub size={20} />
        </a>
      </ToolbarItem>
      <ToolbarItem>
        <button className="animate-wave">
          <MessageCircle size={20} />
        </button>
      </ToolbarItem>
      <ToolbarItem>
        <DarkModeToggle />
      </ToolbarItem>
    </ul>
  );
}
