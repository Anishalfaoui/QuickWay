import Image from "./Image.jsx";

export default function PlaceImg({place,index=0,className=null}) {
  if (!ride.photos?.length) {
    return '';
  }
  if (!className) {
    className = 'object-cover';
  }
  return (
    <Image className={className} src={ride.photos[index]} alt=""/>
  );
}