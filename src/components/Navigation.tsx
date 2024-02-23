const navItems = [
  {
    title: "Skills",
    description: "Tools & technologies.",
    link: "/skills",
    icon: "/skills.png",
  },
  {
    title: "Projects",
    description: "My proudest works.",
    link: "/projects",
    icon: "/projects.png",
  },
  {
    title: "Journey",
    description: "How I got here.",
    link: "/journey",
    icon: "/journey.png",
  },
];

export function NavigationCard({
  title,
  description,
  link,
  icon,
}: {
  title: string;
  description: string;
  link: string;
  icon: string;
}) {
  return (
    <a
      href={link}
      className="group flex w-full flex-col gap-12 rounded-md border border-card-light bg-card-light/5 p-3 transition-colors hover:bg-card-light/10 dark:border-card-dark/15 dark:bg-card-dark/5 dark:hover:bg-card-dark/10"
    >
      <div className="h-8 w-8">
        <img className="h-full w-full" alt="" src={icon} />
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
      <nav className="flex w-full gap-3">
        {navItems.map((item) => (
          <NavigationCard
            key={item.title}
            title={item.title}
            description={item.description}
            link={item.link}
            icon={item.icon}
          />
        ))}
      </nav>
      <NavigationCard
        title="Contact"
        description="Let's get in touch!"
        link="/contact"
        icon="/contact.png"
      />
    </div>
  );
}
