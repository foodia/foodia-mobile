import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Link from "next/link";
import { useAppState } from "./UserContext";
import {
  IconBrandGoogle,
  IconCircleArrowLeft,
  IconEye,
  IconEyeClosed,
  IconLock,
  IconMail,
  IconPassword,
} from "@tabler/icons-react";
import { IconBrandFacebook } from "@tabler/icons-react";
import Header from "../Header";

const LoginPage = () => {
  const [inputEmail, setEmail] = useState("");
  const [inputPassword, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { state, setRegistrasi } = useAppState();
  const [showPassword, setShowPassword] = useState(true);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  useEffect(() => {
    const role = sessionStorage.getItem("role");
    const token = sessionStorage.getItem("token");
    const status = sessionStorage.getItem("status");

    if (role === "detonator" && token && status === "approved") {
      router.push("/detonator");
    } else if (role === "merchant" && token && status === "approved") {
      router.push("/merchant");
    }
  }, [router]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true); // Set loading to true when starting authentication

      const response = await axios.post(
        "https://api.foodia-dev.nuncorp.id/api/v1/auth/login",
        {
          email: inputEmail,
          password: inputPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer YOUR_ACCESS_TOKEN_HERE",
          },
        }
      );

      // const { fullname, phone, email, role, token, user } = response.data.body;

      console.log("res", response.data.body);
      const responeData = response.data.body;

      if (responeData.is_active) {
        sessionStorage.setItem("fullname", responeData.fullname);
        sessionStorage.setItem("phone", responeData.phone);
        sessionStorage.setItem("email", responeData.email);
        sessionStorage.setItem("role", responeData.role);
        sessionStorage.setItem("token", responeData.token);
        sessionStorage.setItem("id", responeData.id || " ");
        sessionStorage.setItem("status", responeData.status || " ");
        sessionStorage.setItem("note", responeData.note || " ");
        Swal.fire({
          icon: "success",
          title: "Login Success",
          text: ` Welcome ${responeData.fullname}`,
          showConfirmButton: false,
          timer: 2000,
        });
        setTimeout(() => {
          router.push("/home");
        }, 2000);
      } else {
        setRegistrasi(responeData);
        Swal.fire({
          icon: "warning",
          title: "Login Failed",
          text: ` please activate your account by login first to access this page`,
          showConfirmButton: false,
          timer: 2000,
        });
        setTimeout(() => {
          router.push("/otp");
        }, 2000);
      }
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Please check your email and password and try again.",
        showConfirmButton: false,
        timer: 2000,
      });
    } finally {
      setLoading(false); // Set loading to false regardless of success or failure
    }
  };

  useEffect(() => {
    if (loading) {
      Swal.showLoading();
    }
  }, [loading]);

  return (
    <div className="container mx-auto mt-24 bg-white">
      <Header backto="/" />
      <div className="flex justify-center ">
        <h1 className="text-4xl text-primary font-bold">FOODIA</h1>
      </div>
      {/* <div className="flex justify-center ">
        <h1 className="text-xl text-primary font-bold">Silahkan Login</h1>
      </div> */}

      <div className="p-4 mt-32 flex flex-col gap-2">
        <div className="flex flex-row items-center p-4 pr-0 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none">
          {/* <label
            htmlFor="password"
            className="block  text-sm font-medium text-gray-900 dark:text-white"
          >
            Your password
          </label> */}
          <IconMail />
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            id="email"
            className="ml-2 w-full p-0 py-4 pl-1 bg-transparent focus:border-none"
            placeholder="Email"
            required
          />
        </div>
        <div className="flex flex-row items-center p-4 pr-2 py-0 bg-gray-100 text-sm rounded-lg focus:ring-blue-500 w-full text-gray-400">
          {/* <label
            htmlFor="password"
            className="block  text-sm font-medium text-gray-900 dark:text-white"
          >
            Your password
          </label> */}
          <IconLock />
          <input
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? "password" : "text"}
            id="password"
            className="ml-2 w-full p-0 py-4 pl-1 bg-transparent"
            placeholder="Password"
            required
          />
          <button onClick={handleClickShowPassword}>
            {showPassword ? <IconEye /> : <IconEyeClosed />}
          </button>
        </div>
        <div className="flex items-start mb-4">
          <Link
            href=""
            htmlFor="remember"
            className="text-xs font-bold text-blue-800"
          >
            Forgot password?
          </Link>
        </div>
        <div className=" grid gap-6 content-center px-4">
          <button
            onClick={handleSubmit}
            type="submit"
            className="text-white bg-primary hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-bold rounded-xl text-md w-full sm:w-auto px-20 py-4 text-center "
          >
            Masuk
          </button>
        </div>
      </div>
      {loading && <div>Loading...</div>}
      {/* <div className="flex items-center mb-4 px-6">
                <div className="border-t border-gray-500 flex-grow"></div>
                <div className="mx-4 text-gray-500">OR</div>
                <div className="border-t border-gray-500 flex-grow"></div>
            </div> */}

      {/* <div className="flex items-center mb-4 px-6">
                <button className="bg-gray-100 shadow-md text-white px-4 py-2 rounded-full mr-2 w-40 h-16 flex flex-col items-center justify-center">
                    <img src='icon/google.png' className=' w-6 ' />
                </button>

                <button className="bg-gray-100 shadow-md text-white px-4 py-2 rounded-full w-40 h-16 flex flex-col items-center justify-center">
                    <img src='icon/facebook.png' className=' w-6 ' />
                </button>
            </div> */}
      <p className="text-gray-600 text-xs font-medium absolute bottom-0 flex mb-5 px-20 ml-8 md:ml-0 md:px-28 gap-1">
        Tidak Memiliki Akun?{" "}
        <Link href="/registrasi" className="text-xs font-bold text-blue-800">
          Daftar
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
