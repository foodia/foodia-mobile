// #region constants

import { IconCirclePlus } from "@tabler/icons-react";
import Link from "next/link";
import styles from "@/styles/Home.module.css";
import Image from "next/image";
import { useRouter } from "next/router";
import { IconBowlFilled } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import axios from "axios";
import Error401 from "@/components/error401";

const MenuBarMechant = () => {
  const router = useRouter();
  const pathname = router.pathname;
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState(0);
  const [role, setRole] = useState();
  const [jumlah, setJumlah] = useState(0);

  useEffect(() => {
    setId(localStorage.getItem("id"));
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    const fetchData = () => {
      axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}rating/not-reviewed?type=merchant&id=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          setLoading(false);
          setJumlah(res.data.body.length);
        }).catch((error) => {
          setLoading(false);
          Error401(error, router);
        });
    };

    if (role === "merchant") {
      setRole(role);
      setId(localStorage.getItem("id"));
      fetchData();
    } else {
      const interval = setInterval(() => {
        const updatedRole = localStorage.getItem("role");
        if (updatedRole === "merchant") {
          clearInterval(interval);
          setRole(updatedRole);
          setId(localStorage.getItem("id"));
          fetchData();
        }
      }, 1000);
    }

  }, [id, pathname]);

  return (
    <div className="flex items-center justify-center px-6 pt-16 ">
      <div className={`bg-gray-100 rounded-2xl w-full p-3`}>
        <div className="flex justify-between items-center text-[12px] font-lato">
          {pathname !== "/merchant" ? (
            <Link
              href="/merchant"
              className="grid justify-items-center gap-1 w-28"
            >
              <div className={`${styles.iconMenu}`}>
                <IconBowlFilled />
              </div>
              <p className=" font-normal text-black">Daftar Menu</p>
            </Link>
          ) : (
            <Link
              href="/createmenu?step=1"
              className="grid justify-items-center gap-1 w-28"
            >
              <div className={`${styles.iconMenu}`}>
                <IconCirclePlus />
              </div>
              <p className=" font-normal text-black">Buat Menu</p>
            </Link>
          )}

          <Link
            href="/merchant/pesanan"
            className="grid justify-items-center gap-1 w-24 "
          >
            <div className={`${styles.iconMenu}`}>
              <Image
                src={"/icon/pesanan.png"}
                alt="Girl in a jacket"
                width={30}
                height={30}
              />
            </div>
            <p className=" font-normal text-black">Pesanan</p>
          </Link>
          <Link
            href="/merchant/saldo"
            className="grid justify-items-center gap-1 w-24 "
          >
            <div className={`${styles.iconMenu}`}>
              <Image
                src={"/icon/saldo.png"}
                alt="Girl in a jacket"
                width={30}
                height={30}
              />
            </div>
            <p className=" font-normal text-black">Saldo</p>
          </Link>

          <Link
            href="/merchant/review"
            className="flex flex-col items-center justify-center gap-1 w-24"
          >
            <div className="relative w-[48px] h-[48px] rounded-md bg-menu text-green flex items-center justify-center">
              {jumlah > 0 && (
                <div className="absolute top-0 right-0 h-[13px] w-[13px] bg-red-500 text-white rounded-full flex items-center justify-center text-[8px] font-bold">
                  <span>{jumlah}</span>
                </div>
              )}

              <Image
                src={"/icon/ulasan.png"}
                alt="Ulasan"
                width={30}
                height={30}
              />
            </div>
            <p className="text-xs font-normal text-black">Ulasan</p>
          </Link>
          <Link
            href="/merchant/kupon"
            className="grid justify-items-center gap-1 w-24 "
          >
            <div className={`${styles.iconMenu}`}>
              <Image
                src={"/icon/kupon.png"}
                alt="Girl in a jacket"
                width={30}
                height={30}
              />
            </div>
            <p className=" font-normal text-black">Kupon</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MenuBarMechant;
