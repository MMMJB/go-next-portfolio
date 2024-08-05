"use client";

import { useState, useEffect, useContext, createContext } from "react";

import { fetchAllVisitors, createVisitor } from "@/app/actions";

const VisitorContext = createContext<{
  visitors: Visitor[];
  dimensions: {
    width: number;
    height: number;
  };
  fetchAllVisitors: () => Promise<Visitor[]>;
  createVisitor: (newVisitor: Visitor) => void;
}>({
  visitors: [],
  dimensions: {
    width: 0,
    height: 0,
  },
  fetchAllVisitors,
  createVisitor,
});

export function useVisitors() {
  return useContext(VisitorContext);
}

export function VisitorsProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [visitors, setVisitors] = useState<Visitor[] | null>(null);
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });

  function handleResize() {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }

  async function prepareAllAvatars(
    visitors: Visitor[],
  ): Promise<Record<string, HTMLImageElement>> {
    if (!visitors.length) return {};

    const avatars = visitors.map((visitor) => visitor.avatar);
    let loaded = 0;

    return await new Promise((resolve) => {
      const images = avatars.map((avatar) => {
        const img = new Image();
        img.onload = () => {
          loaded++;
          if (loaded === avatars.length)
            resolve(
              avatars.reduce(
                (acc, avatar, i) => {
                  acc[avatar] = images[i];
                  return acc;
                },
                {} as Record<string, HTMLImageElement>,
              ),
            );
        };

        img.src = `/api/avatar?url=${avatar}`;
        return img;
      });
    });
  }

  async function onPageLoad() {
    const data = await fetchAllVisitors();
    const images = await prepareAllAvatars(data);

    setVisitors(() =>
      data.map((visitor) => ({
        ...visitor,
        avatarImage: images[visitor.avatar],
      })),
    );
  }

  useEffect(() => {
    handleResize();
    onPageLoad();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!visitors) return;

    setLoading(false);
  }, [visitors]);

  return (
    <VisitorContext.Provider
      value={{
        dimensions,
        fetchAllVisitors,
        createVisitor,
        visitors: visitors || [],
      }}
    >
      {!loading && children}
    </VisitorContext.Provider>
  );
}
