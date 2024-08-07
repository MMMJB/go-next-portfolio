"use client";

import { useState } from "react";

import { TextInput, Dropdown } from "@/components/base/Input";

import projects, { featuredProjects } from "@/lib/projects";

export default function Projects() {
  const [search, setSearch] = useState("");

  return (
    <>
      <header className="grid grid-cols-2 gap-8">
        <h1 className="h1 text-text-dark">My projects</h1>
        <div className="flex flex-col gap-4 text-text-light">
          <span className="h3">Filter projects</span>
          <div className="flex gap-4">
            <TextInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, job, or technology..."
              className="flex-grow"
            />
            <Dropdown options={["Newest", "Oldest"]} selected="Newest" />
          </div>
        </div>
      </header>
    </>
  );
}
