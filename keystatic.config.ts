import { config, fields, collection } from "@keystatic/core";

// Zistíme, či bežíme na produkcii alebo lokálne
const isLocal = process.env.NODE_ENV === "development";

export default config({
  storage: isLocal
    ? {
        kind: "local",
      }
    : {
        kind: "cloud",
      },
  cloud: {
    project: "atelierbam-admin/atelierbamadmin",
  },
  collections: {
    projekty: collection({
      label: "Projekty",
      path: "src/content/projekty/*/",
      slugField: "title",
      entryLayout: "content",
      format: {
        contentField: "content",
      },
      schema: {
        title: fields.slug({
          name: { label: "Názov zložky (Slug)" },
        }),
        order: fields.number({
          label: "Poradie (Order)",
          description:
            "Číslo pre manuálne určenie poradia (1 = prvý projekt, 2 = druhý...). Ak zostane prázdne, projekty sa zoraďujú podľa roku.",
          validation: {
            isRequired: false,
          },
        }),
        description: fields.text({
          label: "Krátky popis (Description)",
          multiline: true,
        }),
        year: fields.text({ label: "Rok", defaultValue: "2024" }),
        type: fields.text({
          label: "Typ projektu",
          defaultValue: "realizácia",
        }),
        location: fields.text({ label: "Lokalita", defaultValue: "Trnava" }),
        featured: fields.checkbox({
          label: "Zobraziť na domovskej stránke",
          defaultValue: true,
        }),

        cover: fields.image({
          label: "Titulný obrázok (Cover)",
          directory: "src/content/projekty",
          publicPath: "/src/content/projekty/",
          transformFilename: (originalFilename) => {
            const ext = originalFilename.split(".").pop() || "jpg";
            return `cover.${ext}`;
          },
        }),

        gallery: fields.array(
          fields.image({
            label: "Obrázok do galérie",
            directory: "src/content/projekty",
            publicPath: "/src/content/projekty/",
            transformFilename: (originalFilename) => {
              return `gallery/${originalFilename}`;
            },
          }),
          {
            label: "Galéria obrázkov",
            itemLabel: (props) => (props.value ? "Obrázok" : "Prázdny obrázok"),
          },
        ),

        content: fields.markdoc({
          label: "Popis projektu (Markdown)",
          extension: "md",
        }),
        isHero: fields.checkbox({
          label: "Použiť tento projekt ako Hero na titulke",
          defaultValue: false,
        }),

        heroImage: fields.image({
          label: "Vlastný Hero obrázok (voliteľné)",
          description:
            "Nahraj alebo vyber konkrétny obrázok pre Hero. Ak zostane prázdne, použije sa titulný cover obrázok.",
          directory: "src/content/projekty",
          publicPath: "../../content/projekty/",
        }),
      },
    }),
  },
});
