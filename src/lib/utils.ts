import { getCollection, type CollectionEntry } from "astro:content";

export interface ProjectWithImages {
  entry: CollectionEntry<"projekty">;
  cleanId: string;
  coverImg: ImageMetadata | null;
  galleryImgs: ImageMetadata[];
}

export async function getProjectsAndImages(): Promise<ProjectWithImages[]> {
  const vsetkyProjekty = await getCollection("projekty");

  // Načítanie obrázkov cez relatívnu cestu
  const allImagesMap = import.meta.glob<{ default: ImageMetadata }>(
    "../content/projekty/**/*.{jpeg,jpg,png,gif,webp,avif,JPEG,JPG,PNG,GIF,WEBP,AVIF}",
  );

  const imagePaths = Object.keys(allImagesMap);

  return Promise.all(
    vsetkyProjekty.map(async (entry) => {
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

      // Galéria
      const galleryKeys = projectImages
        .filter((path) => path.toLowerCase().includes("/gallery/"))
        .sort();

      let coverImg: ImageMetadata | null = null;
      if (coverKey && allImagesMap[coverKey]) {
        const mod = await allImagesMap[coverKey]();
        coverImg = mod.default;
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
        galleryImgs,
      };
    }),
  );
}
