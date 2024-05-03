"use client";

import { useState, useEffect, useContext, createContext } from "react";

import { fetchAllVisitors, createVisitor } from "@/app/actions";

const VisitorContext = createContext<{
  dimensions: {
    width: number;
    height: number;
  };
  loading: boolean;
  fetchAllVisitors: () => Promise<Visitor[]>;
  createVisitor: (newVisitor: Visitor) => void;
}>({
  dimensions: {
    width: 0,
    height: 0,
  },
  loading: true,
  fetchAllVisitors,
  createVisitor,
});

export function useVisitors() {
  return useContext(VisitorContext);
}

export function VisitorsProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });

  function handleResize() {
    setDimensions({
      width: window.innerWidth - 16,
      height: window.innerHeight - 16,
    });
  }

  async function onPageLoad() {
    // const data = await fetchAllPoints();

    setLoading(false);
  }

  useEffect(() => {
    handleResize();
    onPageLoad();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <VisitorContext.Provider
      value={{ dimensions, loading, fetchAllVisitors, createVisitor }}
    >
      {children}
    </VisitorContext.Provider>
  );
}
