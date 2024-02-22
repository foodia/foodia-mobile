import { Inter } from "next/font/google";
import BottomNav from "@/components/BottomNav";
import Hero from "@/components/Hero";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

const Home = () => {
  const router = useRouter();

  // useEffect(() => {
  //   const redirectTimer = setTimeout(() => {
  //     router.push('/home');
  //   }, 2000);

  //   // Membersihkan timer jika komponen unmount sebelum timer selesai
  //   return () => clearTimeout(redirectTimer);
  // }, [router]);

  return (
    <main className="my-0 mx-auto min-h-full mobile-w ">
      <div className="my-0 mx-auto min-h-screen max-w-480 overflow-x-hidden bg-white flex flex-col">
        <Hero />
        <div className="top-0 absolute px-32 pt-28 text-white font-bold text-4xl">
          FOODIA
        </div>
        <div className="flex flex-col pt-5 items-center justify-center gap-2">
          <label className="text-primary text-3xl font-bold">
            Selamat Datang
          </label>
          <label className="text-green-400 text-md w-42 flex flex-col items-center">
            Makanan sebagai Hak, Bukan
            <label className="text-green-400 text-md w-42">Keistimewaan</label>
          </label>
        </div>
        <div className="flex flex-col mt-16 px-5 gap-2">
          <Link
            href="/login"
            className="text-white text-center rounded-xl bg-primary py-2"
          >
            Masuk
          </Link>
          <Link
            href="/registrasi"
            className="text-primary text-center rounded-xl border border-primary py-2"
          >
            Daftar
          </Link>
        </div>
        <div className="absolute bottom-0 px-24 flex gap-1">
          <label className="font-light">Buka aplikasi tanpa</label>
          <Link className="text-blue-950 font-bold pb-8" href="/home">
            Masuk
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Home;
