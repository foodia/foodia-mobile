import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import ProfileDetonator from "@/components/page/Profile/ProfileDetonator";
import ProfileMerchant from "@/components/page/Profile/ProfileMerchant";
import ProfileUser from "@/components/page/Profile/ProfileUser";
import {
  IconCircleLetterA,
  IconEdit,
  IconLogout,
  IconUser,
} from "@tabler/icons-react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const profile = (profile) => {
  const router = useRouter();
  const [role, setRole] = useState("");
  const [dataUser, setDataUser] = useState();

  useEffect(() => {
    const sesionRole = sessionStorage.getItem("role");
    const userData = {
      fullname: sessionStorage.getItem("fullname"),
      phone: sessionStorage.getItem("phone"),
      email: sessionStorage.getItem("email"),
      role: sessionStorage.getItem("role"),
      token: sessionStorage.getItem("token"),
      id: sessionStorage.getItem("id"),
    };
    setDataUser(userData);

    if (sesionRole) {
      setRole(sesionRole);
    } else {
      router.push("/login");
    }
  }, [role]);

  const btnLogout = () => {
    sessionStorage.clear();
    localStorage.removeItem("cart");
    localStorage.removeItem("formData");
    router.push("/login");
  };

  console.log(dataUser);

  return (
    <>
      <main className="my-0 mx-auto mobile-w">
        {/* <Header title="Profile" /> */}
        <div className="my-0 mx-auto overflow-x-hidden bg-white flex flex-col px-5">
          <div class="mx-auto h-full pt-5 pb-36">
            <p className="text-center font-bold">Profile</p>
            <div class="flex flex-row w-full items-center gap-2 py-5">
              {/* <Image
                src={`${process.env.NEXT_PUBLIC_URL_STORAGE}${data.detonator.self_photo}`}
                alt="NotFound"
                width={100}
                height={100}
              /> */}
              {/* <img
                class="bg-transparent"
                src="https://tailwindflex.com/public/images/user.png"
              /> */}
              <IconCircleLetterA size={74} />
              <div className="flex flex-row w-full items-center justify-between">
                <div>
                  <p class="text-md text-primary">{`${dataUser?.fullname}`}</p>
                  <p class="font-normal text-xs">
                    {/* {role === "user" && "User"} */}

                    {role === "detonator" && "Verified Campaigner"}

                    {role === "merchant" && "Merchant"}
                  </p>
                </div>
                <button>
                  <IconEdit />
                </button>
              </div>
            </div>
            {/* <div class="card md:flex max-w-lg">
              <div class="flex-grow items-center justify-center text-center md:text-left">
              </div>
            </div> */}
            <div className="shadow rounded-xl filter-none mb-4 p-3">
              <div class="card md:flex max-w-lg">
                <div class="flex-grow text-center md:text-left">
                  <div className="mt-2 mb-3">
                    <p class="font-bold">Email</p>
                    <p>{`${dataUser?.email}`}</p>
                  </div>
                </div>
              </div>
              <div class="card md:flex max-w-lg">
                <div class="flex-grow text-center md:text-left">
                  <div className="mt-2 mb-3">
                    <p class="font-bold">Nomer HP</p>
                    <p>{`${dataUser?.phone}`}</p>
                  </div>
                </div>
              </div>
              <div class="card md:flex max-w-lg">
                <div class="flex-grow text-center md:text-left">
                  <div className="mt-2 mb-3">
                    <p class="font-bold">Alamat</p>
                    <p>
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                      Deleniti quo reprehenderit, porro rerum perspiciatis
                      pariatur voluptas ex quas excepturi similique atque, animi
                      autem consectetur. Facere dolore commodi mollitia maiores
                      fuga.
                    </p>
                  </div>
                </div>
              </div>
              {/* {role === "user" && <ProfileUser />}

              {role === "detonator" && <ProfileDetonator />}

              {role === "merchant" && <ProfileMerchant />} */}
              {role === 'user' && (
                <ProfileUser />
              )}

              {role === 'detonator' && (
                <ProfileDetonator />
              )}

              {role === 'merchant' && (
                <ProfileMerchant id={dataUser?.id} />
              )}
            </div>
            <button
              onClick={btnLogout}
              className="flex items-center justify-center bg-white border-2 border-primary rounded-lg w-full h-10 text-primary font-bold text-center"
            >
              Keluar
            </button>
            {/* </div> */}
          </div>
        </div>
      </main>
      <BottomNav />
    </>
  );
};

export default profile;
