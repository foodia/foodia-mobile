import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import Error401 from "@/components/error401";
import ProfileDetonator from "@/components/page/Profile/ProfileDetonator";
import ProfileMerchant from "@/components/page/Profile/ProfileMerchant";
import {
  IconChevronRight,
  IconDeviceMobile,
  IconEdit,
  IconHome,
  IconMail,
  IconUser,
} from "@tabler/icons-react";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const MerchantUpdateProfile = (profile) => {
  const router = useRouter();
  const [role, setRole] = useState("");
  const [dataUser, setDataUser] = useState();
  const [isMerchant, setIsMerchant] = useState(false);
  const [merchantStatus, setMerchantStatus] = useState("");
  const [merchantId, setMerchantId] = useState();
  const [isDetonator, setIsDetonator] = useState(false);
  const [detonatorStatus, setDetonatorStatus] = useState("");
  const [detonatorId, setDetonatorId] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(
        `${
          process.env.NEXT_PUBLIC_API_BASE_URL
        }merchant/fetch/${localStorage.getItem("Merchant_id")}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        setDataUser(response.data.body);
        setLoading(false);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          Error401(error, router);
        }
      });
  }, []);

  const btnLogout = () => {
    setLoading(true);
    localStorage.clear();
    localStorage.clear();
    localStorage.removeItem("cart");
    localStorage.removeItem("formData");
    router.push("/login");
  };

  return (
    <>
      <div className="bg-white flex flex-col px-1 h-screen">
        <Header title="Ubah Profile Toko" />
        <div class="pt-12 w-full h-screen flex flex-col">
          <div className="flex flex-col items-center justify-center mt-5 w-full mb-4">
            <div className="w-24 h-24 rounded-full bg-blue-100 grid place-items-center text-blue-600">
              <IconUser />
            </div>
            <button className="text-xs mt-2 text-[#1D5882] font-semibold">
              Ganti
            </button>
          </div>
          <div className="mb-4 p-3 px-2 flex flex-col gap-3">
            <div className="flex flex-row items-center p-3 pr-0 py-0 bg-transparent border-2 border-primary text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none">
              <IconUser />
              <input
                // onChange={(e) => setEmail(e.target.value)}
                value={`${dataUser?.merchant_name}`}
                type="text"
                id="name"
                className="text-black ml-2 w-full p-0 py-4 pl-1 bg-transparent focus:border-none"
                placeholder="Nama"
                required
              />
            </div>
            <div className="flex flex-row items-center p-3 pr-0 py-0 bg-transparent border-2 border-primary text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none">
              <IconDeviceMobile />
              <input
                // onChange={(e) => setEmail(e.target.value)}
                value={`${dataUser?.no_link_aja}`}
                type="text"
                id="name"
                className="text-black ml-2 w-full p-0 py-4 pl-1 bg-transparent focus:border-none"
                placeholder="No. Hp"
                required
              />
            </div>
            <div className="flex flex-row items-center p-3 pr-0 py-0 bg-transparent border-2 border-primary text-gray-400 text-sm rounded-lg outline-none w-full focus:border-none">
              <IconHome />
              <textarea
                // onChange={(e) => setEmail(e.target.value)}
                type="text"
                id="address"
                className="text-black ml-2 w-full p-0 py-4 pl-1 bg-transparent focus:border-none outline-none"
                placeholder="Alamat"
                required
                value={`${dataUser?.address}`}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end py-8 px-2">
          <button
            onClick={btnLogout}
            className="flex items-center justify-center bg-primary border-2 border-primary rounded-lg w-full h-10 text-white   font-bold text-center"
          >
            Ubah
          </button>
        </div>
        {loading && <Loading />}
      </div>
    </>
  );
};

export default MerchantUpdateProfile;
