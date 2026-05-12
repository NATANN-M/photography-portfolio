import { prisma } from "@/lib/prisma";

export async function createAlbum(data: {
    name: string;
    slug: string;
    description?: string;
    coverImage?: string;
    createdById: string;
}) {
    return prisma.album.create({
        data,
    });
}

export async function getAlbums() {
    return prisma.album.findMany({
        orderBy: { createdAt: "desc" },
    });
}

export async function getAlbumById(id: string) {
    return prisma.album.findUnique({
        where: { id },
        include: {
            photos: true,
        },
    });
}

export async function updateAlbum(id: string, data: any) {
  return prisma.album.update({
    where: { id },
    data,
  });
}

export async function deleteAlbum(id: string) {
    // Delete all photos in the album first to avoid foreign key constraint errors
    await prisma.photo.deleteMany({
        where: { albumId: id },
    });

    // Then delete the album
    return prisma.album.delete({
        where: { id },
    });
}

export async function getAlbumBySlug(slug: string) {
  return prisma.album.findUnique({
    where: { slug },
    include: {
      photos: true,
    },
  });
}
