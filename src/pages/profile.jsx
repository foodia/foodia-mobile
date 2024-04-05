import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import Error401 from "@/components/error401";
import ProfileDetonator from "@/components/page/Profile/ProfileDetonator";
import ProfileMerchant from "@/components/page/Profile/ProfileMerchant";
import { IconChevronRight, IconEdit, IconUser } from "@tabler/icons-react";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const profile = (profile) => {
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
    const sesionRole = localStorage.getItem("role");
    const userData = {
      fullname: localStorage.getItem("fullname"),
      phone: localStorage.getItem("phone"),
      email: localStorage.getItem("email"),
      role: localStorage.getItem("role"),
      token: localStorage.getItem("token"),
      id: localStorage.getItem("id"),
    };
    setDataUser(userData);

    console.log("ds", userData);

    if (sesionRole) {
      setRole(sesionRole);
    } else {
      router.push("/login");
    }
  }, [role]);

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}auth/check-register-status`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        setLoading(false);
        const cekData = response.data.body;
        if (cekData.detonator !== null) {
          setIsDetonator(true);
          setDetonatorId(cekData.detonator.detonator_id);
          if (cekData.detonator.status === "approved") {
            setDetonatorStatus("Verified Detonator");
          } else if (cekData.detonator.status === "waiting") {
            setDetonatorStatus("Waiting For Verification");
          } else {
            setDetonatorStatus("Rejected");
          }
        }
        if (cekData.merchant !== null) {
          setIsMerchant(true);
          setMerchantId(cekData.merchant.merchant_id);
          if (cekData.merchant.status === "approved") {
            setMerchantStatus("Verified Merchant");
          } else if (cekData.merchant.status === "waiting") {
            setMerchantStatus("Waiting For Verification");
          } else {
            setMerchantStatus("Rejected");
          }
        }
      })
      .catch((error) => {
        setLoading(false);
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
      {/* <main className="my-0 mx-auto mobile-w h-full"> */}
      <div className="bg-white flex flex-col px-5 h-full pb-20">
        <Header />
        <div class="pt-12 pb-32 w-full">
          <p className="text-center font-bold text-lg">Profile</p>
          <div className="items-center justify-center mt-5 w-full mb-4">
            <div className="w-full bg-white text-black rounded-lg inline-flex items-center px-1 py-2.5">
              <div className="flex justify-between w-full">
                <div className="flex w-full">
                  <div className="w-14 h-12 rounded-full bg-blue-100 grid place-items-center mr-2 text-blue-600">
                    <IconUser />
                  </div>
                  <div className="text-left flex flex-row justify-between w-full">
                    <div className="flex flex-col justify-center">
                      <p class="text-md text-primary">{`${dataUser?.fullname}`}</p>
                      {isDetonator && (
                        <p class="font-normal text-xs">Verified Campaigner</p>
                      )}
                    </div>
                    {!isDetonator && (
                      <button>
                        <IconEdit />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button className="shadow rounded-xl flex flex-row justify-between w-full text-left filter-none mb-4 p-3">
            <p>Ubah Kata Sandi</p>
            <IconChevronRight className="text-primary" />
          </button>
          <div className="shadow rounded-xl filter-none mb-4 p-3 px-5">
            <div class="card md:flex max-w-lg">
              <div class="flex-grow text-left md:text-left">
                <div className="mt-2 text-left mb-3">
                  <p class="font-bold">Email</p>
                  <p>{`${dataUser?.email}`}</p>
                </div>
              </div>
            </div>
            <div class="card md:flex max-w-lg">
              <div class="flex-grow text-left md:text-left">
                <div className="mt-2 text-left mb-3">
                  <p class="font-bold">Nomer HP</p>
                  <p>{`${dataUser?.phone}`}</p>
                </div>
              </div>
            </div>
            {isDetonator && <ProfileDetonator id={detonatorId} />}
          </div>

          {isMerchant && (
            <ProfileMerchant id={merchantId} merchantStatus={merchantStatus} />
          )}

          <button
            onClick={btnLogout}
            className="flex items-center justify-center bg-white border-2 border-primary rounded-lg w-full h-10 text-primary font-bold text-center"
          >
            Keluar
          </button>
          {/* </div> */}
        </div>
        {loading && <Loading />}
      </div>
      {/* </main> */}
      <BottomNav />
    </>
  );
};

export default profile;
