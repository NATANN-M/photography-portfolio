import { prisma } from "@/lib/prisma";
import { unstable_noStore as noStore } from "next/cache";


export async function createPhoto(data: {
  title: string;
  description?: string;
  imageUrl: string;
  albumId: string;
  uploadedById: string;
}) {
  noStore();

  return prisma.photo.create({
    data,
  });
}


export async function getPhotosByAlbum(albumId: string) {
  noStore();

  return prisma.photo.findMany({
    where: { albumId },
    orderBy: { createdAt: "desc" },
  });
}


export async function getPhotosCount() {
  noStore();

  return prisma.photo.count();
}


let cache: any = null;
let cacheTime = 0;

function shuffle<T>(arr: T[]) {
  return arr
    .map((v) => ({ v, r: Math.random() }))
    .sort((a, b) => a.r - b.r)
    .map((x) => x.v);
}

export async function getRecentPhotos(limit: number = 8) {
  noStore(); // still ensures no Next.js caching issues

  const now = Date.now();

  //  CACHE FOR 60 seconds 
  if (cache && now - cacheTime < 60_000) {
    return cache.slice(0, limit);
  }

  // 1. fetch more than needed
  const photos = await prisma.photo.findMany({
    take: 30,
    orderBy: { createdAt: "desc" },
    include: {
      album: true,
    },
  });

  // 2. randomize
  const randomized = shuffle(photos);

  // 3. store cache
  cache = randomized;
  cacheTime = now;

  return randomized.slice(0, limit);
}


export async function getAllPhotos() {
  noStore();

  return prisma.photo.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      album: true,
    },
  });
}


export async function deletePhoto(id: string) {
  noStore();

  return prisma.photo.delete({
    where: { id },
  });
}


export async function getPhotoById(id: string) {
  noStore();

  return prisma.photo.findUnique({
    where: { id },
    include: {
      album: true,
    },
  });
}



export async function updatePhoto(
  id: string,
  data: { title?: string; description?: string; albumId?: string }
) {
  noStore();

  return prisma.photo.update({
    where: { id },
    data,
  });
}


export async function deletePhotos(ids: string[]) {
  noStore();

  return prisma.photo.deleteMany({
    where: {
      id: { in: ids },
    },
  });
}