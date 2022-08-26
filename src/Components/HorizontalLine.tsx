import React from 'react';
import * as RN from 'react-native';

type HorizontalLineProps = {
  width?: number;
  color?: string;
};

const HorizontalLine: React.FC<HorizontalLineProps> = props => {
  return (
    <RN.View
      style={{
        padding: props.width || 1,
        margin: 3,
        borderRadius: 5,
        backgroundColor: props.color || '#333',
      }}></RN.View>
  );
};

export default HorizontalLine;
