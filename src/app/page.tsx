import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200">
        Welcome to My Photography Portfolio
      </h1>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
        Explore my collection of stunning photographs captured around the world.
      </p>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Example photos */}
        <Image
          src="/photo1.jpg"
          alt="Photo 1"
          width={400}
          height={300}
          className="rounded-lg shadow-md"
        />
        
    </div>
    </div>
  );
}