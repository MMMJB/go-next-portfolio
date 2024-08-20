"use client";

import { useRef, useState, useEffect, useContext, useMemo } from "react";

import { Frown } from "react-feather";
import { TextInput, Dropdown } from "@/components/base/Input";
import { ProjectPreview } from "@/components/Preview";
import CardSection from "@/components/base/Section";

import defaultProjects from "@/lib/projects";
import { AnimationContext } from "@/components/AnimationPlayer";

const p = Object.values(defaultProjects);

export default function Projects() {
  const [search, setSearch] = useState("");
  const [state, setState] = useState("default");
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("Newest");

  const projects = useMemo(() => p.sort(sort), [sort]);

  const refresh = useContext(AnimationContext);

  useEffect(() => {
    const newState = search ? "search" : "default";

    if (state !== newState) {
      refresh();
      setState(newState);
    }
  }, [search]);

  useEffect(() => {
    if (!search) return;

    setSearchResults(
      projects
        .filter((project) =>
          project.searchString.includes(search.toLowerCase()),
        )
        .map((p) => p._id),
    );
  }, [projects]);

  function sort(a: Project, b: Project, sortType = sortBy) {
    const dateA = a.startDate;
    const dateB = b.startDate;

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
                    .map((p) => p._id),
                );
              }}
              placeholder="Search by title, job, or technology..."
              className="flex-grow"
            />
            <Dropdown
              onChange={(v) => {
                if (v === sortBy) return;

                setSortBy(v);
              }}
              options={["Newest", "Oldest"]}
              selected="Newest"
            />
          </div>
        </div>
      </header>
      <CardSection
        title={
          state === "default"
            ? `All projects (${projects.length})`
            : `Search results (${searchResults.length})`
        }
      >
        {projects.map(({ _id, ...rest }) => (
          <ProjectPreview
            hidden={state === "search" && !searchResults.includes(_id)}
            query={search}
            key={_id}
            {...rest}
          />
        ))}
        {search && !searchResults.length && (
          <p className="p col-span-2 flex flex-col items-center justify-center gap-3 rounded-md border border-border px-10 py-8 text-text-light">
            <Frown />
            No results found for &ldquo;{search}&rdquo;.
          </p>
        )}
      </CardSection>
    </>
  );
}
