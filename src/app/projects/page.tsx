"use client";

import { useRef, useState, useEffect, useContext } from "react";

import { Frown } from "react-feather";
import { TextInput, Dropdown } from "@/components/base/Input";
import { ProjectPreview } from "@/components/Preview";
import CardSection from "@/components/base/Section";

import projects, { featuredProjects } from "@/lib/projects";
import { AnimationContext } from "@/components/AnimationPlayer";

export default function Projects() {
  const previousState = useRef("default");

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Project[]>([]);
  const [sortBy, setSortBy] = useState("Newest");

  const refresh = useContext(AnimationContext);

  useEffect(() => {
    const state = search ? "search" : "default";

    if (previousState.current !== state) {
      refresh();
      previousState.current = state;
    }
  }, [search]);

  function sort(a: Project, b: Project, sortType = sortBy) {
    const dateA = new Date(a.startDate).valueOf();
    const dateB = new Date(b.startDate).valueOf();

    return sortType === "Newest" ? dateB - dateA : dateA - dateB;
  }

  return (
    <>
      <header className="grid grid-cols-2 gap-8">
        <h1 className="h1 text-text-dark">My projects</h1>
        <div className="flex flex-col gap-4 text-text-light">
          <span className="h3">Filter projects</span>
          <div className="flex gap-4">
            <TextInput
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSearchResults(
                  projects
                    .filter((project) =>
                      project.searchString.includes(
                        e.target.value.toLowerCase(),
                      ),
                    )
                    .sort(sort),
                );
              }}
              placeholder="Search by title, job, or technology..."
              className="flex-grow"
            />
            <Dropdown
              onChange={(v) => {
                if (v === sortBy) return;

                setSortBy(v);
                setSearchResults(searchResults.sort((a, b) => sort(a, b, v)));
              }}
              options={["Newest", "Oldest"]}
              selected="Newest"
            />
          </div>
        </div>
      </header>
      {!search ? (
        <DefaultView />
      ) : (
        <CardSection title={`Search results (${searchResults.length})`}>
          {searchResults.map((project) => (
            <ProjectPreview query={search} key={project._id} {...project} />
          ))}
          {!searchResults.length && (
            <p className="p col-span-2 flex flex-col items-center justify-center gap-3 rounded-md border border-border px-10 py-8 text-text-light">
              <Frown />
              No results found for &ldquo;{search}&rdquo;.
            </p>
          )}
        </CardSection>
      )}
    </>
  );
}

function DefaultView() {
  return (
    <>
      <CardSection title={`Featured projects (${featuredProjects.length})`}>
        {featuredProjects.map((project) => (
          <ProjectPreview key={project._id} {...project} />
        ))}
      </CardSection>
      <CardSection title={`All projects (${projects.length})`}>
        {projects.map((project) => (
          <ProjectPreview key={project._id} {...project} />
        ))}
      </CardSection>
    </>
  );
}
