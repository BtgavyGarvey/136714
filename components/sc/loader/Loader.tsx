'use client'
import React from "react";
// import loaderImg from "../../public/system-images/loader.gif";
import Image from "next/image";

const Loader = () => {
  return (
    <>
    <div className="wrapper">
      <div className="loader">
      <Image 
      src="/systemFiles/loader.gif"
      alt="Loading..."
      width={100}
      height={100}
      priority
      />
      </div>
    </div>
    
    </>
  );
};

// export const SpinnerImg = () => {
//   return (
//     <div className="--center-all">
//       <img src={loaderImg} alt="Loading..." />
//     </div>
//   );
// };

export default Loader;
