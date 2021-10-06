import React from 'react';
import { FixedSizeList } from 'react-window';


const Row = ({ index, style }) => {
    return (
  <div style={style}>
     { console.log(index)}
     {/* define the row component using items[index] */}
  </div>
)}

const ListComponent = ({items}) => (
  <FixedSizeList
    height={500}
    width={500}
    itemSize={120}
    itemCount={items.length}
  >
    {Row}
  </FixedSizeList>
);

export default ListComponent;