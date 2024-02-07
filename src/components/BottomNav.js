import { IconSmartHome, IconSearch, IconBell, IconUser, IconQrcode, IconLogin } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const BottomNav = () => {
  const router = useRouter();
  const [token, setToken] = useState('');

  useEffect(() => {
    const storedToken = sessionStorage.getItem('token');
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

  return (
    <div className="mobile-w fixed flex justify-center h-20 bottom-0 my-0 mx-auto w-full max-w-screen-sm ">
      <div className="kotak shadow-inner">
        <Link href="/home" className="menu1 icon_nav hover:text-primary"><IconSmartHome /></Link>
        <div className="menu3 icon_nav hover:text-primary"><IconBell /></div>
        <div className="menu2 icon_nav hover:text-primary"><IconSearch /></div>
        {token ? (
          <Link href="/profile" className="menu4 icon_nav hover:text-primary"><IconUser /></Link>
        ) : (
          <Link href="/login" className="menu4 icon_nav hover:text-primary"><IconLogin /></Link>
        )}
        <div className="lingkaran">
          <div className="iconQr flex items-stretch p-1"><IconQrcode width={32} height={32} /></div>
        </div>
      </div>
    </div>
  );
};

export default BottomNav;
