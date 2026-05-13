import { prisma } from "@/lib/prisma";

export async function createPhoto(data: {
  title: string;
  description?: string;
  imageUrl: string;
  albumId: string;
  uploadedById: string;
}) {
  return prisma.photo.create({
    data,
  });
}

export async function getPhotosByAlbum(albumId: string) {
  return prisma.photo.findMany({
    where: { albumId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getPhotosCount() {
  return prisma.photo.count();
}

export async function getRecentPhotos(limit: number = 5) {
  return prisma.photo.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      album: true,
    },
  });
}

export async function getAllPhotos() {
  return prisma.photo.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      album: true,
    },
  });
}

export async function deletePhoto(id: string) {
  return prisma.photo.delete({
    where: { id },
  });
}

export async function getPhotoById(id: string) {
  return prisma.photo.findUnique({
    where: { id },
    include: {
      album: true,
    },
  });
}

export async function updatePhoto(id: string, data: { title?: string, description?: string, albumId?: string }) {
  return prisma.photo.update({
    where: { id },
    data,
  });
}

export async function deletePhotos(ids: string[]) {
  return prisma.photo.deleteMany({
    where: {
      id: { in: ids },
    },
  });
}