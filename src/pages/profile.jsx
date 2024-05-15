import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import styles from "@/styles/Home.module.css";
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
    // const sesionRole = localStorage.getItem("role");
    // const userData = {
    //   fullname: localStorage.getItem("fullname"),
    //   phone: localStorage.getItem("phone"),
    //   email: localStorage.getItem("email"),
    //   role: localStorage.getItem("role"),
    //   token: localStorage.getItem("token"),
    //   id: localStorage.getItem("id"),
    // };
    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}auth/profile/fetch`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setLoading(false);
        setDataUser(res.data.body);
        setRole(res.data.body.role);
      })
      .catch((error) => {
        setLoading(false);
        Error401(error, router);
      });
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
            setMerchantStatus("Menunggu Verifikasi");
          } else {
            setMerchantStatus("Ditolak");
          }
        }
      })
      .catch((error) => {
        setLoading(false);
        Error401(error, router);
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

  const UpdateProfile = () => {
    router.push("/profile-update");
  };

  const ChangePassword = () => {
    router.push("/change-password");
  };

  const MerchantUpdateProfile = () => {
    localStorage.setItem("Merchant_id", merchantId);
    router.push("/merchant-profile-update");
  };

  return (
    <>
      <div className="bg-white flex flex-col px-5 h-screen pb-20">
        {/* <Header /> */}
        <div class="pt-4 h-screen overflow-auto pb-32 w-full">
          <p className="text-center font-bold text-lg">Profile</p>
          {loading ? (
            <div className={`${styles.card} `}>
              {[...Array(3)].map((_, index) => (
                <div key={index} className={`${styles.loadingCard}`}>
                  <div className={`${styles.shimmer}`}></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="items-center justify-center mt-5 w-full mb-4">
                <div className="flex">
                  <div className="w-20 h-20 rounded-full bg-blue-100 grid place-items-center mr-2 text-blue-600">
                    {dataUser?.profile_pic !== "" ? (
                      <div className="w-20 h-20 rounded-full bg-blue-100 grid place-items-center mr-2 text-blue-600">
                        <img
                          src={`${process.env.NEXT_PUBLIC_URL_STORAGE}${dataUser?.profile_pic}`}
                          alt=""
                          className="w-20 h-20 rounded-full bg-blue-100 grid place-items-center text-blue-600 object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-blue-100 grid place-items-center mr-2 text-blue-600">
                        <IconUser />
                      </div>
                    )}
                  </div>
                  <div className="text-left flex flex-row justify-between w-full">
                    <div className="flex flex-col justify-center">
                      <p class="text-md text-primary">{dataUser?.fullname}</p>
                      {isDetonator && (
                        <p class="font-normal text-xs">{detonatorStatus}</p>
                      )}
                    </div>
                    {!isDetonator && (
                      <button onClick={() => UpdateProfile()}>
                        <IconEdit />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => ChangePassword()}
                className="shadow rounded-xl flex flex-row justify-between w-full text-left filter-none mb-4 p-3"
              >
                <p>Ubah Kata Sandi</p>
                <IconChevronRight className="text-primary" />
              </button>
              <div className="shadow rounded-xl filter-none mb-4 p-3 px-5">
                <div class="card flex max-w-lg">
                  <div class="flex-grow text-left">
                    <div className="mt-2 text-left mb-3">
                      <p class="font-bold">Email</p>
                      <p>{dataUser?.email}</p>
                    </div>
                  </div>
                </div>
                <div class="card flex max-w-lg">
                  <div class="flex-grow text-left">
                    <div className="mt-2 text-left mb-3">
                      <p class="font-bold">Nomer HP</p>
                      <p>{dataUser?.phone}</p>
                    </div>
                  </div>
                </div>
                {isDetonator && <ProfileDetonator id={detonatorId} />}
              </div>

              {isMerchant && (
                <ProfileMerchant
                  id={merchantId}
                  merchantStatus={merchantStatus}
                  MerchantUpdateProfile={MerchantUpdateProfile}
                />
              )}

              <button
                onClick={btnLogout}
                className="flex items-center justify-center bg-white border-2 border-primary rounded-lg w-full h-10 text-primary font-bold text-center"
              >
                Keluar
              </button>
            </>
          )}
        </div>
        {loading && <Loading />}
      </div>
      <BottomNav />
    </>
  );
};

export default profile;
