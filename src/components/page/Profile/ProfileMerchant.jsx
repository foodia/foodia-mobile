import Error401 from "@/components/error401";
import { IconEdit } from "@tabler/icons-react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ProfileMerchant = ({ id = 0 }) => {
  const router = useRouter();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const response = axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}merchant/fetch/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setData(response.data.body);
        setLoading(false);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          Error401(error, router);

        }
        console.error("Error fetching data:", error);
      });
    console.log("data Merchant", data);
  }, [id]);

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
        <div
          //   href={`/food`}
          className="w-full h-16 bg-white text-black rounded-lg inline-flex items-center px-1 py-2.5 "
        >
          <div className="flex justify-between w-full">
            <div className="flex">
              {/* <IconSoup className=" w-7 h-7" /> */}
              <div className="w-12 h-12 rounded-full bg-blue-100 grid place-items-center mr-2 text-blue-600">
                <img
                  src="/img/icon/icon_food_order.png"
                  alt=""
                  className="w-8 h-8"
                />
              </div>
              <div className="text-left place-items-start">
                <div className="mb-1 text-primary">Merchant</div>
                <div className="-mt-1 font-sans text-xs ">
                  {
                    data?.products.filter(
                      (product) => product.status === "approved"
                    ).length
                  }{" "}
                  Verified Menu{" "}
                </div>
              </div>
            </div>
            {/* <div className="grid place-items-center">
                            <IconEdit className=" grid grid-cols-3 gap-4 place-items-end " />
                        </div> */}
          </div>
        </div>
      </div>

      <div class="block max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow mb-4">
        <h5 class=" text-lg font-bold text-gray-900 ">Nama Toko</h5>
        <p class="mb-2 font-normal text-gray-700 ">{data?.merchant_name}</p>

        <h5 class=" text-lg font-bold text-gray-900 ">Alamat Toko</h5>
        <p class="mb-2 font-normal text-gray-700 ">{data?.address}</p>

        <h5 class=" text-lg font-bold text-gray-900 ">Nomor Link Aja</h5>
        <p class="font-normal text-gray-700 ">{data?.no_link_aja}</p>
      </div>
    </>
  );
};

export default ProfileMerchant;
