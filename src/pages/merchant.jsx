import { Inter } from "next/font/google";
import BottomNav from "@/components/BottomNav";
import Merchant from "@/components/page/Merchant";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export default function PageMerchant() {
    return (
        <main className="">
            <Header title="Merchant" />
            <div className="my-0 mx-auto min-h-screen max-w-480 overflow-x-hidden bg-white flex flex-col">
                {/* <Hero /> */}
                <Merchant />
                {/* <HomePage /> */}
            </div>
            <BottomNav />
        </main>
    );
}
