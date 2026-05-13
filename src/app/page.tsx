import { getSettings } from "@/services/setting.service";
import { getAlbums } from "@/services/album.service";
import { getRecentPhotos } from "@/services/photo.service";
import HomeClient from "@/components/home/HomeClient";


export default async function HomePage() {
  // Fetch data on the server
  const [setting, albums, recentPhotos] = await Promise.all([
    getSettings(),
    getAlbums(),
    getRecentPhotos(8)
  ]);

  return (
    <HomeClient 
      initialSetting={setting} 
      initialAlbums={albums} 
      initialRecentPhotos={recentPhotos} 
    />
  );
}