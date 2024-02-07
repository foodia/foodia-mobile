// GeoMap.js
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

const LocationMarker = ({ sendDataToPage, tracking }) => {
    const [position, setPosition] = useState(null);
    const [locationInfo, setLocationInfo] = useState(null);
    const [loading, setLoading] = useState(false);

    const map = useMapEvents({
        click() {
            if (tracking) {
                map.locate();
            }
        },
        locationfound(e) {
            if (tracking) {
                setPosition(e.latlng);
                map.flyTo(e.latlng, map.getZoom());
                fetchLocationInfo(e.latlng);
            } else {
                setPosition(e.latlng);
            }
        },
    });

    useEffect(() => {
        if (!tracking && position) {
            fetchLocationInfo(position);
        }
    }, [position, tracking]);

    const fetchLocationInfo = async (latlng) => {
        try {
            setLoading(true);
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latlng.lat}&lon=${latlng.lng}&format=json`
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch location information. Status: ${response.status}`);
            }

            const data = await response.json();



            setLocationInfo({
                province: data.address.state || 'Provinsi tidak diketahui',
                city: data.address.city || 'Kota tidak diketahui',
                postal_code: data.address.postcode || 'Kode postal code tidak diketahui',
                sub_district: data.address.neighbourhood || 'sub district tidak diketahui',
                address: data.address.road || 'Alamat Jalan tidak diketahui',
                fullAdres: data.display_name || 'Lokasi tidak diketahui',
                coordinates: {
                    lat: latlng.lat,
                    lng: latlng.lng,
                },
                response: data

            });

        } catch (error) {
            console.error('Error fetching location information:', error.message);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        if (sendDataToPage && locationInfo) {
            sendDataToPage(locationInfo);
            console.log('data lokasi', locationInfo);
        }
    }, [locationInfo, sendDataToPage]);

    const handleMarkerDragEnd = (e) => {
        setPosition(e.target.getLatLng());
    };

    return position === null ? null : (
        <Marker
            position={position}
            icon={L.icon({
                iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                tooltipAnchor: [16, -28],
                shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
                shadowSize: [41, 41],
            })}
            draggable={tracking ? false : true}
            eventHandlers={tracking ? null : { dragend: handleMarkerDragEnd }}
        >
            <Popup>
                {loading ? (
                    <p>Mengambil informasi lokasi...</p>
                ) : locationInfo ? (
                    <div>
                        <p>Provinsi: {locationInfo.province}</p>
                        <p>Kota: {locationInfo.city}</p>
                        <p>Kecamatan: {locationInfo.sub_district}</p>
                        <p>Alamat: {locationInfo.address}</p>
                    </div>
                ) : null}
            </Popup>
        </Marker>
    );
};

const GeoMap = ({ sendDataToPage, tracking }) => {

    return (
        <>
            <MapContainer
                center={{ lat: -6.2088, lng: 106.8456 }}
                zoom={13}
                style={{ height: '200px', width: '100%' }}
                scrollWheelZoom={false}
            >
                <TileLayer
                    attribution='Click the map to get the location'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker sendDataToPage={sendDataToPage} tracking={tracking} />
            </MapContainer>
        </>
    );
};

export default GeoMap;
