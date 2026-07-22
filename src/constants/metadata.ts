export const SITE_METADATA_COPY = {
  title: "Первые пробные тренировки — ПадлХАБ",
  description:
    "Актуальное расписание первых пробных тренировок ПадлХАБ в формате турнирной ленты.",
  locale: "ru_RU",
  siteName: "ПадлХАБ",
  ogImagePath: "og.png",
  localBaseUrl: "http://localhost:3000/",
} as const;

export const OG_IMAGE_SIZE = {
  width: 1730,
  height: 909,
} as const;

export function getSiteBaseUrl(): URL {
  const repository = process.env.GITHUB_REPOSITORY;
  if (!repository) return new URL(SITE_METADATA_COPY.localBaseUrl);

  const [owner, repositoryName] = repository.split("/");
  const isUserOrOrganizationPage = repositoryName.endsWith(".github.io");
  const path = isUserOrOrganizationPage ? "" : `${repositoryName}/`;

  return new URL(`https://${owner}.github.io/${path}`);
}
