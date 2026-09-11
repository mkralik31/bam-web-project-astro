import { getCollection, type CollectionEntry } from "astro:content";

export interface ProjectWithImages {
  entry: CollectionEntry<"projekty">;
  cleanId: string;
  coverImg: ImageMetadata | null;
  heroImg: ImageMetadata | null;
  galleryImgs: ImageMetadata[];
}

export async function getProjectsAndImages(): Promise<ProjectWithImages[]> {
  const allProjects = await getCollection("projekty");

  // Načítanie obrázkov cez relatívnu cestu
  const allImagesMap = import.meta.glob<{ default: ImageMetadata }>(
    "../content/projekty/**/*.{jpeg,jpg,png,gif,webp,avif,JPEG,JPG,PNG,GIF,WEBP,AVIF}",
  );

  const imagePaths = Object.keys(allImagesMap);

  const projectsWithImages = await Promise.all(
    allProjects.map(async (entry) => {
      // Normalizujeme Windows/Linux lomítka a očistíme od index/md
      const normalizedId = entry.id.replace(/\\/g, "/");

      // Extrahujeme názov zložky (napr. "01_byt-r")
      const folderName = normalizedId.split("/")[0].toLowerCase();
      const cleanId = folderName;

      // Hľadáme obrázky pre daný priečinok
      const projectImages = imagePaths.filter((path) => {
        const pathLower = path.toLowerCase().replace(/\\/g, "/");
        return pathLower.includes(`/${folderName}/`);
      });

      // Cover obrázok (mimo gallery/, začína na cover.)
      const coverKey = projectImages.find((path) => {
        const pathLower = path.toLowerCase();
        const fileName = pathLower.split("/").pop() || "";
        return (
          !pathLower.includes("/gallery/") && fileName.startsWith("cover.")
        );
      });

      // Špeciálny Hero obrázok (mimo gallery/, začína na hero.)
      const heroKey = projectImages.find((path) => {
        const pathLower = path.toLowerCase();
        const fileName = pathLower.split("/").pop() || "";
        return !pathLower.includes("/gallery/") && fileName.startsWith("hero.");
      });

      // Galéria
      const galleryKeys = projectImages
        .filter((path) => path.toLowerCase().includes("/gallery/"))
        .sort();

      let coverImg: ImageMetadata | null = null;
      if (coverKey && allImagesMap[coverKey]) {
        const mod = await allImagesMap[coverKey]();
        coverImg = mod.default;
      }

      let heroImg: ImageMetadata | null = null;
      if (heroKey && allImagesMap[heroKey]) {
        const mod = await allImagesMap[heroKey]();
        heroImg = mod.default;
      }

      const galleryImgs: ImageMetadata[] = [];
      for (const key of galleryKeys) {
        if (allImagesMap[key]) {
          const mod = await allImagesMap[key]();
          galleryImgs.push(mod.default);
        }
      }

      return {
        entry,
        cleanId,
        coverImg,
        heroImg: heroImg || coverImg,
        galleryImgs,
      };
    }),
  );

  // Centralized sorting logic
  return projectsWithImages.sort((a, b) => {
    const orderA =
      a.entry.data.order !== null && a.entry.data.order !== undefined
        ? Number(a.entry.data.order)
        : 999;
    const orderB =
      b.entry.data.order !== null && b.entry.data.order !== undefined
        ? Number(b.entry.data.order)
        : 999;

    // 1. Zoradenie podľa zadaného poradia (1, 2, 3...)
    if (orderA !== orderB) {
      return orderA - orderB;
    }

    // 2. Bezpečné načítanie prvej štvorčíslice z roka (napr. z "2024" alebo "2023-2024")
    const parseYear = (val: unknown) => {
      const match = String(val || "").match(/\d{4}/);
      return match ? parseInt(match[0], 10) : 0;
    };

    const yearA = parseYear(a.entry.data.year);
    const yearB = parseYear(b.entry.data.year);

    return yearB - yearA;
  });
}
