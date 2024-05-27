import Compressor from "compressorjs";
import { useEffect, useState } from "react";

const Tes = () => {
    const [foto, setFoto] = useState(null);
    const [ukuran, setUkuran] = useState(null);

    const uploadImage = (event) => {
        const file = event.target.files[0];
        if (file.size <= 3 * 1024 * 1024) {
            setFoto(file);
            setUkuran((file.size / (1024 * 1024)).toFixed(2));
        } else {
            new Compressor(file, {
                quality: 0.6,
                maxWidth: 1024,
                success(result) {
                    setFoto(result);
                    setUkuran((result.size / (1024 * 1024)).toFixed(2));
                },
                error(err) {
                    // console.log(err.message);
                }
            });
        }
    }

    useEffect(() => {
        // console.log(foto);
    }, [foto]);

    return (
        <div className="">
            <input type="file" onChange={uploadImage} />
            <div className="">
                {foto && (
                    <>
                        <div>
                            <img src={URL.createObjectURL(foto)} alt="gambar" />
                        </div>
                        <div>
                            Ukuran gambar: {ukuran} MB
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Tes;
