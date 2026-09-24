import { useMapEvents } from "react-leaflet";

const MapCenterUpdater = ({
  onLocationChange,
}) => {
  useMapEvents({ 
    moveend(event) {
      const map = event.target;

      const center = map.getCenter();

      onLocationChange(
        center.lat,
        center.lng
      );
    }, 
  });

  return null;
};

export default MapCenterUpdater;