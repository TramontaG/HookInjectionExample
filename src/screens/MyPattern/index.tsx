import React from 'react';
import AnotherRender from './AnotherRender';
import useCounter, {InitialProps} from './Logic';

const CounterComponent = (initialProps: InitialProps) => 
  <AnotherRender {...useCounter(initialProps)} />;
;
export default CounterComponent;
