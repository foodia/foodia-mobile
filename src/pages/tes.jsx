// pages/index.js
import Gallery from '../components/Gallery';

const HomePage = () => {
    const images = [
        'https://via.placeholder.com/300x200.png?text=Image+1',
        'https://via.placeholder.com/300x200.png?text=Image+2',
        'https://via.placeholder.com/300x200.png?text=Image+3',
        'https://via.placeholder.com/300x200.png?text=Image+4',
        'https://via.placeholder.com/300x200.png?text=Image+5',
    ];

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Image Gallery</h1>
            <Gallery images={images} />
        </div>
    );
};

export default HomePage;
