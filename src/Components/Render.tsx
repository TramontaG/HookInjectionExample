import React, {PropsWithChildren} from 'react';

type RenderIfProps = PropsWithChildren<{
  if: boolean;
}>;

const RenderIf = (props: RenderIfProps) => props.if ? <>{props.children}</> : null;

export default RenderIf;
