import React from 'react';
import { Img } from 'react-image';
import { origin } from '../../utility/commonUtility';
let backup = `${origin}/img/product/productplaceholder.png`
const Placeholder = () => <Img src={backup}/>;
// const Placeholder = () => <p>loading...</p>;
export default function Image({
  alt,
  className,
  style,
  src,
}) {
  return (
    <Img
      draggable={true}
      style={style}
      src={[src, backup]}
      alt={alt}
      loader={<Placeholder />}
      unloader={<Placeholder />}
      className={className}
      loading="lazy"
    />
  );
}
