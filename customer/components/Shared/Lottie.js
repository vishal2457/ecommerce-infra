import React from 'react'
import LottieJS from "react-lottie";

function Lottie({data, height, width}) {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: data,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice",
        },
      };
    return (
        <LottieJS options={defaultOptions} height={height} width={width} />
    )
}

export default Lottie
