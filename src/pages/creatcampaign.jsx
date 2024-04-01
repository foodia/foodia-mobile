// src/pages/creatcampaign.jsx
import { ContextAddCampaignProvider } from "@/components/FormCampaing/ContextAddCampaign";
import Header from "@/components/Header";
import FormCampaing from "@/components/page/FormCampaing";
import { useRouter } from "next/router";

const CreatCampaignPage = ({ pageProps }) => {
  // useEffect(() => {
  //     const role = localStorage.getItem('role');
  //     const token = localStorage.getItem('token');

  //     if (!role || !token || role !== 'detonator') {
  //         // Redirect to login if either role or token is missing or role is not 'detonator'
  //         router.push('/login');
  //     } else {
  //         // Role is 'detonator' and token is present
  //         setLoading(false); // Set loading to false once the check is complete
  //     }
  // }, [router]);
  const router = useRouter();
  const { step } = router.query;

  return (
    <ContextAddCampaignProvider>
      <main className="my-0 mx-auto min-h-full mobile-w">
        <div className="my-0 mx-auto min-h-screen max-w-480 overflow-x-hidden bg-white flex flex-col">
          <Header title={step <= 3 ? `Buat Campaign ${step}/3` : ``} />
          <FormCampaing {...pageProps} />
        </div>
      </main>
    </ContextAddCampaignProvider>
  );
};

export default CreatCampaignPage;
