export function cn(...classes: (string | undefined | null | false | Record<string, boolean>)[]) {
  return classes
    .flatMap((c) => {
      if (!c) return [];
      if (typeof c === "string") return c.split(" ");
      if (typeof c === "object") return Object.keys(c).filter((k) => c[k]);
      return [];
    })
    .filter(Boolean)
    .join(" ");
}
