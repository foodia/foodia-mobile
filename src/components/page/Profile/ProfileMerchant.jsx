import { IconArrowNarrowRight, IconEdit } from "@tabler/icons-react";
import Link from "next/link";

const ProfileMerchant = () => {
    return (
        <>
            {/* <div class="card md:flex max-w-lg">
                <div class="flex-grow text-center md:text-left">
                    <div className="mt-2 mb-3">
                        <p class="font-bold">User Merchant</p>
                        <p >Merchant User</p>
                    </div>
                </div>
            </div> */}

            <div className="items-center justify-center mt-1 w-full mb-4">
                <Link href={`/food`} className="w-full h-16 bg-white hover:bg-gray-100  text-black rounded-lg inline-flex items-center px-2.5 py-2.5 ">
                    <div className="flex justify-between w-full">
                        <div className="flex">
                            {/* <IconSoup className=" w-7 h-7" /> */}
                            <div className="w-12 h-12 rounded-full bg-blue-100 grid place-items-center mr-2 text-blue-600">
                                <img src="/img/icon/icon_food_order.png" alt="" className="w-8 h-8" />
                            </div>
                            <div className="text-left place-items-start">
                                <div className="mb-1 text-primary">Merchant</div>
                                <div className="-mt-1 font-sans text-xs ">3 Verified Merchant </div>
                            </div>
                        </div>
                        <div className="grid place-items-center">
                            <IconEdit className=" grid grid-cols-3 gap-4 place-items-end " />
                        </div>
                    </div>
                </Link>
            </div>

            <div class="block max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow mb-4">

                <h5 class=" text-lg font-bold text-gray-900 ">Nama Toko</h5>
                <p class="mb-2 font-normal text-gray-700 ">Mie Ayam Pak Somat</p>

                <h5 class=" text-lg font-bold text-gray-900 ">Alamat Toko</h5>
                <p class="mb-2 font-normal text-gray-700 ">Jl Kebon Sirih nomor 102, Jakarta Pusat, Jakarta</p>

                <h5 class=" text-lg font-bold text-gray-900 ">Nomor Link Aja</h5>
                <p class="font-normal text-gray-700 ">
                    081271918207
                </p>
            </div>

        </>
    );
}

export default ProfileMerchant;