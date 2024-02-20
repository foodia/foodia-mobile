import { Inter } from "next/font/google";
import BottomNav from "@/components/BottomNav";
import HomePage from "@/components/page/HomePage";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export default function PageHome() {
    return (

        <main className="">
            {/* <Header /> */}

            <div className="container my-0 mx-auto min-h-screen max-w-480 overflow-x-hidden bg-white flex flex-col">
                {/* <Hero /> */}
                <HomePage />
                {/* <HomePage /> */}
            </div>
            <BottomNav />
        </main>
    );
}
