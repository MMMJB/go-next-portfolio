// import { useEffect } from "react";
import type {} from "ldrs";

const sizeMap = {
  sm: "16",
  md: "24",
  lg: "32",
};

export default function Loader({
  size = "md",
  color,
}: {
  size?: "sm" | "md" | "lg";
  color?: string;
}) {
  // useEffect(() => {
  //   (async () => {
  //     const { ring2 } = await import("ldrs");
  //     ring2.register();
  //   })();
  // }, []);

  return <l-ring-2 color={color || "white"} stroke={3} size={sizeMap[size]} />;
}
