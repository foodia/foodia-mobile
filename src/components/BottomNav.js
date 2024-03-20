import {
  IconSmartHome,
  IconSearch,
  IconBell,
  IconUser,
  IconQrcode,
  IconLogin,
  IconReceipt,
  IconMail,
} from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useAppState } from "./page/UserContext";
import Image from "next/image";
import bottomNav from "../../public/img/icon/BottomNavField.png";
import { usePathname } from "next/navigation";

const BottomNav = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [token, setToken] = useState("");
  const { state, setDonation } = useAppState();
  const [nominalDonasi, setNominalDonasi] = useState(0);
  const [loading, setLoading] = useState(false);

  console.log(pathname);

  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    // Fetch the token from sessionStorage when the component mounts
    if (storedToken) {
      setToken(storedToken);
    }
  }, [token]); // Empty dependency array to run once when the component mounts

  // const btnLogout = () => {
  //   sessionStorage.clear();
  //   localStorage.removeItem('cart');
  //   localStorage.removeItem('formData');
  //   router.push('/home');
  // };

  const showSweetAlert = async () => {
    const swal = Swal.mixin({
      customClass: {
        popup: "custom-swal",
        icon: "custom-icon-swal",
        confirmButton: "custom-confirm-button-swal", // Custom class for styling
      },
      didRender: () => {
        const nominalInput = document.querySelector('input[name="nominal"]');
        const donationRadios = document.querySelectorAll('input[name="donation"]');

        // Menambahkan event listener untuk setiap radio button nominal
        donationRadios.forEach(radio => {
          radio.addEventListener('click', () => {
            // Menghapus nilai input nominal jika opsi nominal dipilih
            nominalInput.value = '';
          });
        });

        // Menghapus nilai input nominal jika pengguna mulai mengetik di dalamnya
        nominalInput.addEventListener('input', () => {
          donationRadios.forEach(radio => {
            radio.checked = false;
          });
        });
      }
    });

    await swal.fire({
      position: "bottom",
      html: `
            <div class="absolute px-24 ml-10 top-0 mt-4">
                <hr class="border border-gray-400 w-10 h-1 bg-gray-400 rounded-lg "/>
            </div>
            <div class="mt-4">
                <p class="text-md font-bold">Pilih Nominal Donasi</p>
                <div class="flex flex-col space-y-4 pt-5">
                    <label>
                        <input type="radio" name="donation" class="hidden peer" value="20000" />
                        <div class="cursor-pointer peer-checked:bg-blue-900 peer-checked:text-white bg-gray-100 py-2 px-4 rounded-lg font-semibold">Rp 20.000</div>
                    </label>
                    <label>
                        <input type="radio" name="donation" class="hidden peer" value="50000" />
                        <div class="cursor-pointer peer-checked:bg-blue-900 peer-checked:text-white bg-gray-100 py-2 px-4 rounded-lg font-semibold">Rp 50.000</div>
                    </label>
                    <label>
                        <input type="radio" name="donation" class="hidden peer" value="100000" />
                        <div class="cursor-pointer peer-checked:bg-blue-900 peer-checked:text-white bg-gray-100 py-2 px-4 rounded-lg font-semibold">Rp 100.000</div>
                    </label>
                    <label>
                        <input type="radio" name="donation" class="hidden peer" value="200000" />
                        <div class="cursor-pointer peer-checked:bg-blue-900 peer-checked:text-white bg-gray-100 py-2 px-4 rounded-lg font-semibold">Rp 200.000</div>
                    </label>
                    <div class="bg-gray-100 p-3 rounded-lg">
                        <label class=" items-center text-base ">
                            Nominal Donasi Lainnya
                        </label>
                        <div class="pl-5 gap-4 flex flex-row items-center mt-2 bg-white text-sm rounded-xl focus:ring-blue-500 ">
                            <label class="w-6">Rp </label>
                            <input type="number" name="nominal" class="p-2.5 focus:border-blue-500 dark:placeholder-gray-400 outline-none w-full rounded-xl ">
                        </div>
                    </div>
                </div>
            </div>
            `,
      width: "375px",
      showConfirmButton: true,
      confirmButtonText: "Donasi",
      confirmButtonColor: "#3FB648",
    }).then((result) => {
      if (result.isConfirmed) {
        const radioValue = document.querySelector('input[name="donation"]:checked');
        const nominalValue = document.querySelector('input[name="nominal"]');

        setLoading(true);
        if (!radioValue && nominalValue && nominalValue.value) {
          handleSubmit(nominalValue.value);
        } else if (radioValue) {
          handleSubmit(radioValue.value);
        } else {
          Swal.fire("Error", "Pilih atau isi nominal donasi.", "error");
        }
      }
    });
  };



  const handleSubmit = (value) => {
    setNominalDonasi(parseInt(value));
    const data = {
      amount: parseInt(value),
      payment_channel: "",
      success_url: `${process.env.NEXT_PUBLIC_URL_PAYMEN}`,
      detail: {
        campaign_id: "",
        description: "Donation",
        donation_type: "agnostic",
      },
    };
    setDonation(data);
    setLoading(false);
    router.push("/metode_pembayaran");
  };

  return (
    <div className="mobile-w bg-transparent fixed flex justify-center h-24 bottom-0 w-full max-w-screen-sm">
      <Image src={bottomNav} className="bg-transparent" layout="fill"></Image>
      {/* <div className="kotak bg-white"> */}
      <div
        className={`menu1 icon_nav hover:text-primary 
        ${pathname === "/home" ? "text-primary" : "text-gray-400"}
        `}
      >
        <Link className="items-center flex flex-col gap-1" href="/home">
          <IconSmartHome />
          <p className="text-xs">Home</p>
        </Link>
      </div>
      <div
        className={`menu2 icon_nav hover:text-primary 
        ${pathname === "" ? "text-primary" : "text-gray-400"}
        `}
      >
        {/* <Link className="items-center flex flex-col gap-1" href="">
          <IconReceipt />
          <p className="text-xs">Receipt</p>
        </Link> */}
      </div>
      <div
        className={`menu3 icon_nav hover:text-primary 
        ${pathname === "" ? "text-primary" : "text-gray-400"}
        `}
      >
        {/* <Link className="items-center flex flex-col gap-1" href="">
          <IconMail />
          <p className="text-xs">Inbox</p>
        </Link> */}
      </div>
      {token ? (
        <div
          className={`menu4 icon_nav hover:text-primary 
        ${pathname === "/profile" ? "text-primary" : "text-gray-400"}
        `}
        >
          <Link className="items-center flex flex-col gap-1" href="/profile">
            <IconUser />
            <p className="text-xs">Profile</p>
          </Link>
        </div>
      ) : (
        <div
          className={`menu4 icon_nav hover:text-primary 
        ${pathname === "/profile" ? "text-primary" : "text-gray-400"}
        `}
        >
          <Link className="items-center flex flex-col gap-1" href="/login">
            <IconLogin />
            <p className="text-xs">Login</p>
          </Link>
        </div>
      )}
      <div className="lingkaran cursor-pointer" onClick={showSweetAlert}>
        <div className="iconQr flex items-stretch p-1">
          <IconQrcode width={32} height={32} color="white" />
        </div>
      </div>
    </div>
    // </div>
  );
};

export default BottomNav;
