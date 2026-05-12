import { prisma } from "@/lib/prisma";

export async function getSettings() {
  return prisma.siteSetting.findFirst();
}

export async function updateSettings(data: {
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: string;
}) {
  const existing = await prisma.siteSetting.findFirst();

  if (existing) {
    return prisma.siteSetting.update({
      where: { id: existing.id },
      data,
    });
  } else {
    return prisma.siteSetting.create({
      data: {
        heroTitle: data.heroTitle || "Default Title",
        heroSubtitle: data.heroSubtitle || "",
        heroImage: data.heroImage || "",
      },
    });
  }
}
