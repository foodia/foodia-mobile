
import CameraScan from "@/components/page/Merchant/CameraScan";
import { useRouter } from "next/router";

const ScanKupon = () => {
    const router = useRouter();
    const { id } = router.query;
    return (
        <main className="my-0 mx-auto min-h-full mobile-w">
            <CameraScan />
        </main>
    );
}

export default ScanKupon;