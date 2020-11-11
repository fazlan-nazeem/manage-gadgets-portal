import React from 'react';

const ImportDeviceData = props => {
  const isOpen = props.isOpen;
  console.log(isOpen);
  if (isOpen === true) {
    return (
      <div>
        <input
          accept="image/*"
          id="raised-button-file"
          multiple
          type="file"
          hidden
        />
      </div>
    );
  } else {
    return <div></div>;
  }
};

export default ImportDeviceData;
