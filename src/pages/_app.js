import { AppStateProvider } from "@/components/page/UserContext";
import MainLayout from "@/layouts/MainLayout";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <AppStateProvider>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </AppStateProvider>
  );
}
