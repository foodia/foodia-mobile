import { Inter } from "next/font/google";
import BottomNav from "@/components/BottomNav";
import Merchant from "@/components/page/Merchant";

const inter = Inter({ subsets: ["latin"] });

export default function PageMerchant() {
    return (
        <main className="">
            <div className="my-0 mx-auto min-h-screen max-w-480 overflow-x-hidden bg-white flex flex-col">
                {/* <Hero /> */}
                <Merchant />
                {/* <HomePage /> */}
            </div>
            <BottomNav />
        </main>
    );
}
