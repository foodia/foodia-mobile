import Header from "@/components/Header";
import Loading from "@/components/Loading";
import {
  IconDeviceMobile,
  IconEye,
  IconEyeClosed,
  IconLock,
  IconMail,
  IconUser,
} from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const ChangePassword = (profile) => {
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
  const [showPassword, setShowPassword] = useState(true);
  const [showRepeatPassword, setShowRepeatPassword] = useState(true);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowRepeatPassword = () =>
    setShowRepeatPassword((show) => !show);

  useEffect(() => {
    setLoading(false);
    const sesionRole = localStorage.getItem("role");

    if (sesionRole) {
      setRole(sesionRole);
    } else {
      router.push("/login");
    }
  }, [role]);

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
        <Header title="Ubah Kata Sandi" />
        <div class="pt-16 w-full h-screen flex flex-col">
          <div className="mb-4 p-3 px-2 flex flex-col gap-3">
            <p className="text-sm">Masukkan kata sandi baru</p>
            <div className="flex flex-row items-center p-4 pr-2 py-0 bg-gray-100 text-sm rounded-lg focus:ring-blue-500 w-full text-gray-400">
              <IconLock />
              <input
                // onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "password" : "text"}
                id="password"
                className="text-black ml-2 w-full p-0 py-4 pl-1 bg-transparent"
                placeholder="Kata Sandi Baru"
                required
              />
              <button onClick={handleClickShowPassword}>
                {showPassword ? <IconEye /> : <IconEyeClosed />}
              </button>
            </div>
            <p className="text-sm">Masukkan ulang kata sandi baru</p>
            <div className="flex flex-row items-center p-4 pr-2 py-0 bg-gray-100 text-sm rounded-lg focus:ring-blue-500 w-full text-gray-400">
              <IconLock />
              <input
                // onChange={(e) => setPassword(e.target.value)}
                type={showRepeatPassword ? "password" : "text"}
                id="password"
                className="text-black ml-2 w-full p-0 py-4 pl-1 bg-transparent"
                placeholder="Ulang Kata Sandi Baru"
                required
              />
              <button onClick={handleClickShowRepeatPassword}>
                {showRepeatPassword ? <IconEye /> : <IconEyeClosed />}
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-end py-8 px-2">
          <button
            onClick={btnLogout}
            className="flex items-center justify-center bg-primary border-2 border-primary rounded-lg w-full h-10 text-white   font-bold text-center"
          >
            Kirim
          </button>
        </div>
        {loading && <Loading />}
      </div>
    </>
  );
};

export default ChangePassword;
