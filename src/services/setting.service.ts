import { prisma } from "@/lib/prisma";

export async function getSettings() {
  return prisma.siteSetting.findFirst();
}

export async function updateSettings(data: {
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: string;
  logoUrl?: string;
  useDefaultLogo?: boolean;
  profilePicUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  instagramUrl?: string;
  vimeoUrl?: string;
  telegramUrl?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  location?: string;
  aboutText?: string;
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
        logoUrl: data.logoUrl || "",
        useDefaultLogo: data.useDefaultLogo !== undefined ? data.useDefaultLogo : true,
        profilePicUrl: data.profilePicUrl || "",
        contactEmail: data.contactEmail || "",
        contactPhone: data.contactPhone || "",
        instagramUrl: data.instagramUrl || "",
        vimeoUrl: data.vimeoUrl || "",
        telegramUrl: data.telegramUrl || "",
        facebookUrl: data.facebookUrl || "",
        youtubeUrl: data.youtubeUrl || "",
        location: data.location || "",
        aboutText: data.aboutText || "",
      },
    });
  }
}
