import { getCollection } from "astro:content";

export async function getSortedProjects() {
  const vsetkyProjekty = await getCollection("projekty");

  return [...vsetkyProjekty].sort((a, b) => {
    // Ak order chýba, dáme fallback 99
    const orderA =
      a.data.order !== null && a.data.order !== undefined
        ? Number(a.data.order)
        : 99;
    const orderB =
      b.data.order !== null && b.data.order !== undefined
        ? Number(b.data.order)
        : 99;

    if (orderA !== orderB) {
      return orderA - orderB;
    }

    // Druhotné radenie podľa roku (najnovšie prvé)
    const yearA = Number(a.data.year || 0);
    const yearB = Number(b.data.year || 0);

    return yearB - yearA;
  });
}
