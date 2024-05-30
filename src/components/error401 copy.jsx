'use client';
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const Error401 = (errCode) => {
    const router = useRouter();
    const code = errCode?.response?.data?.code;

    if (code === 401) {
        // localStorage.clear();
        Swal.fire({
            icon: "error",
            title: "Sesi Anda Berakhir",
            text: `Silakan Login Kembali untuk Melanjutkan`,
            showConfirmButton: true,
            confirmButtonText: "Login",
            confirmButtonColor: "green",
            showCancelButton: true,
            cancelButtonText: "Tutup",
            cancelButtonColor: "red",
            // timer: 2000,
        }).then((result) => {
            if (result.isConfirmed) {
                setLoading(true);
                router.push('/login');
            } else if (result.isDismissed) {
                router.push("/home");
            }
        });
        // router.push('/login');
    } else if (errCode.code === "ERR_NETWORK") {
    }

    return null;
}

export default Error401;


