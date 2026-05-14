import { prisma } from "@/lib/prisma";
import { unstable_noStore as noStore } from "next/cache";

export async function createAlbum(data: {
    name: string;
    slug: string;
    description?: string;
    coverImage?: string;
    createdById: string;
}) {
    noStore();

    return prisma.album.create({
        data,
    });
}

export async function getAlbums() {
    noStore();

    return prisma.album.findMany({
        orderBy: { createdAt: "desc" },
    });
}

export async function getAlbumById(id: string) {
    noStore();

    return prisma.album.findUnique({
        where: { id },
        include: {
            photos: true,
        },
    });
}

export async function updateAlbum(id: string, data: any) {
    noStore();

    return prisma.album.update({
        where: { id },
        data,
    });
}

export async function deleteAlbum(id: string) {
    noStore();

    await prisma.photo.deleteMany({
        where: { albumId: id },
    });

    return prisma.album.delete({
        where: { id },
    });
}

export async function getAlbumBySlug(slug: string) {
    noStore();

    return prisma.album.findUnique({
        where: { slug },
        include: {
            photos: true,
        },
    });
}