import { Inter } from "next/font/google";
import BottomNav from "@/components/BottomNav";
import Detonator from "@/components/page/Detonator";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export default function PageDetonator() {
    return (
        <main className="">
            <Header title="Detonator" />
            <div className="my-0 mx-auto min-h-screen max-w-480 overflow-x-hidden bg-white flex flex-col">
                {/* <Hero /> */}
                <Detonator />
                {/* <HomePage /> */}
            </div>
            <BottomNav />
        </main>
    );
}
