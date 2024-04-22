import BottomNav from "@/components/BottomNav";
import CardInbox from "@/components/CardInbox";

const inbox = (inbox) => {
    return (
        <>
            <div className="container mx-auto h-screen max-w-480 bg-white flex flex-col">
                <div className="bg-white h-10 bottom-0 my-0  rounded-md mt-2 mx-2 grid grid-cols-2  place-content-center">
                    <div className={` h-10 w-full col-span-2 flex justify-center items-center`}>
                        <h1 className="text-xl font-bold">Inbox</h1>
                    </div>
                </div>
                <div className="flex flex-row px-4 py-4 justify-between items-end">
                    <div className="cursor-pointer text-center relative group text-lg font-semibold text-gray-500 hover:text-primary">
                        <span>Donator</span>
                        <hr className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full border-t-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="cursor-pointer text-center relative group text-lg font-semibold text-gray-500 hover:text-primary">
                        <span>Detonator</span>
                        <hr className="absolute bottom-0 left-1/2 transform -translate-x-1/2  w-full border-t-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="cursor-pointer text-center relative group text-lg font-semibold text-gray-500 hover:text-primary">
                        <span>Merchant</span>
                        <hr className="absolute bottom-0 left-1/2 transform -translate-x-1/2  w-full border-t-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                </div>
                {/* <CardInbox /> */}

                <CardInbox
                    status="Campain Baru"
                    title="Bagi Makanan Jumat Barokah"
                    desc="Ada campaign baru loh, yuk intip detailnya, dan mari bantu sesama"
                    url="/campBaru"
                />

                <CardInbox
                    status="Campaign Selesai"
                    title="TEBAR 1000 PAKET NASI JUMAT BERKAH"
                    desc="Campaign telah selesai, mari cek detail campaign nya"
                    url="/campSelesai"
                />
                <CardInbox
                    status="Laporan Campaign"
                    title="TEBAR 1000 PAKET NASI JUMAT BERKAH"
                    desc="Buka untuk cek laporan kegiatan campaign"
                    url="/LaporanCamp"
                />

            </div>
            <BottomNav />
        </>
    );
}

export default inbox;