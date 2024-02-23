const navItems = [
  {
    title: "Skills",
    description: "Tools & technologies.",
    link: "/skills",
    icon: "/skills.png",
    className: "group-hover:animate-pie",
  },
  {
    title: "Projects",
    description: "My proudest works.",
    link: "/projects",
    icon: "/projects.png",
    className: "group-hover:animate-spin-slow",
  },
  {
    title: "Journey",
    description: "How I got here.",
    link: "/journey",
    icon: "/journey.png",
    className: "group-hover:animate-jump",
  },
];

export function NavigationCard({
  title,
  description,
  link,
  icon,
  className = "",
}: {
  title: string;
  description: string;
  link: string;
  icon: string;
  className?: string;
}) {
  return (
    <a
      href={link}
      className="group flex w-full flex-col gap-12 rounded-md border border-card-light bg-card-light/5 p-3 transition-colors hover:bg-card-light/10 dark:border-card-dark/15 dark:bg-card-dark/5 dark:hover:bg-card-dark/10"
    >
      <div className="h-8 w-8">
        <img className={`h-full w-full ${className}`} alt="" src={icon} />
      </div>
      <div className="flex flex-col text-end">
        <h3 className="font-semibold">{title}</h3>
        <span className="text-xs">{description}</span>
      </div>
    </a>
  );
}

export default function Nav() {
  return (
    <div className="flex flex-col gap-3">
      <nav className="flex w-full flex-col gap-3 sm:flex-row">
        {navItems.map((item) => (
          <NavigationCard key={item.title} {...item} />
        ))}
      </nav>
      <NavigationCard
        title="Contact"
        description="Let's get in touch!"
        link="/contact"
        icon="/contact.png"
        className="group-hover:animate-jiggle"
      />
    </div>
  );
}
