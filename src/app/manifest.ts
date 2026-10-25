import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Decoritu — Considered things for beautiful living",
    short_name: "Decoritu",
    description: "Thoughtfully chosen bedding, curtains, dohars, cushions, rugs and objects for the home.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8f4ed",
    theme_color: "#272722",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
