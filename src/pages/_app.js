import { useEffect } from "react";
import { useState } from "react"; // Tambahkan useState
import { useRouter } from "next/router"; // Import useRouter
import { AppStateProvider } from "@/components/page/UserContext";
import MainLayout from "@/layouts/MainLayout";
import "@/styles/globals.css";
import NextTopLoader from "nextjs-toploader";

export default function App({ Component, pageProps }) {
  const router = useRouter(); // Deklarasikan useRouter
  const [id_user, setIdUser] = useState("");
  const [userData, setUserData] = useState({
    id: "",
    fullname: "",
    phone: "",
    email: "",
    role: "",
    token: "",
    status: "",
    note: ""
  }); // Buat state untuk menyimpan data pengguna

  useEffect(() => {
    setIdUser(sessionStorage.getItem("id"));
    const fullname = localStorage.getItem("fullname");
    const phone = localStorage.getItem("phone");
    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");
    const status = localStorage.getItem("status");
    const note = localStorage.getItem("note");

    if (id) {
      // Jika id tersedia, simpan data pengguna ke sessionStorage
      sessionStorage.setItem("id", id);
      sessionStorage.setItem("fullname", fullname);
      sessionStorage.setItem("phone", phone);
      sessionStorage.setItem("email", email);
      sessionStorage.setItem("role", role);
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("status", status);
      sessionStorage.setItem("note", note);

      // Simpan data pengguna ke state
      setUserData({
        id,
        fullname,
        phone,
        email,
        role,
        token,
        status,
        note
      });

      // Redirect ke halaman /home jika pengguna sudah login
      router.push("/home");
    }
  }, [id_user]); // Tambahkan dependensi kosong agar useEffect hanya dijalankan sekali

  return (
    <AppStateProvider>
      <MainLayout>
        <NextTopLoader />
        <Component {...pageProps} />
      </MainLayout>
    </AppStateProvider>
  );
}
