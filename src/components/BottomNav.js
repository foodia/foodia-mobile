import { IconSmartHome, IconSearch, IconBell, IconUser, IconQrcode, IconLogin } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useAppState } from './page/UserContext';

const BottomNav = () => {
  const router = useRouter();
  const [token, setToken] = useState('');
  const { state, setDonation } = useAppState();
  const [nominalDonasi, setNominalDonasi] = useState(0);

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

  const showSweetAlert = async () => {
    const { value } = await Swal.fire({
      position: 'bottom',
      title: 'Pilih Nominal Donasi',
      html: `
        <div class="flex flex-col space-y-2">
            <label>
                <input  type="radio" name="donation" id="donation" class="hidden peer" value="50000"  />
                <div class="peer-checked:bg-primary bg-green-200 py-2 px-4 rounded-lg font-semibold">Rp 50.000</div>
            </label>
            <label>
                <input  type="radio" name="donation" id="donation" class="hidden peer" value="100000"  />
                <div class="peer-checked:bg-primary bg-green-200 py-2 px-4 rounded-lg font-semibold">Rp. 100.000</div>
            </label>
            <label>
                <input  type="radio" name="donation" id="donation" class="hidden peer" value="250000"  />
                <div class="peer-checked:bg-primary bg-green-200 py-2 px-4 rounded-lg font-semibold">Rp. 250.000</div>
            </label>
            <label>
                <input  type="radio" name="donation" id="donation" class="hidden peer" value="500000"  />
                <div class="peer-checked:bg-primary bg-green-200 py-2 px-4 rounded-lg font-semibold">Rp. 500.000</div>
            </label>
                
            
            <div class="bg-gray-200 p-2 rounded-lg">
          <label class=" items-center text-base ">
          Nominal Donasi Lainnya
          </label>
            <input type="number" name="nominal" class="items-center mt-2 bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 0 dark:placeholder-gray-400  "> 
            
          </div>
        </div>`,
      width: "375px",
      focusConfirm: false,
      showCancelButton: true,
      cancelButtonText: 'Batal',
      confirmButtonText: 'Pilih',
      preConfirm: () => {
        const radioValue = document.querySelector('input[name="donation"]:checked');
        if (!radioValue) {
          const nominalValue = document.querySelector('input[name="nominal"]');
          if (nominalValue && nominalValue.value) {
            // return nominalValue.value;
            handleSubmit(nominalValue.value);
          } else {
            return 'input nominal value';
          }
        } else {
          // return radioValue.value;
          handleSubmit(radioValue.value);
        }
      },
      // customClass: {
      //   container: 'your-custom-container-class',
      //   popup: 'your-custom-popup-class',
      //   title: 'your-custom-title-class',
      //   content: 'your-custom-content-class',
      //   confirmButton: 'your-custom-confirm-button-class',
      //   cancelButton: 'your-custom-cancel-button-class',
      // },
    });

    // if (value) {
    //     setNominalDonasi(parseInt(value));
    // }
  };

  const handleSubmit = (value) => {
    setNominalDonasi(parseInt(value));
    const data = {
      'amount': parseInt(value),
      'payment_channel': '',
      'success_url': `${process.env.NEXT_PUBLIC_URL_PAYMEN}`,
      'detail': {
        'campaign_id': '',
        'description': 'Donation',
        'donation_type': 'agnostic',
      }
    }
    setDonation(data);
    router.push('/metode_pembayaran');
  };

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
        <div className="lingkaran cursor-pointer" onClick={showSweetAlert}>
          <div className="iconQr flex items-stretch p-1"><IconQrcode width={32} height={32} /></div>
        </div>
      </div>
    </div>
  );
};

export default BottomNav;
