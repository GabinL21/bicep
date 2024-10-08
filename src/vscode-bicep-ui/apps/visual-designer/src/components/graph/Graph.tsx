import { PanZoomTransformed } from "@vscode-bicep-ui/components";
import { EdgeLayer } from "./EdgeLayer";
import { NodeLayer } from "./NodeLayer";
import { styled } from "styled-components";

const $PanZoomTransformed = styled(PanZoomTransformed)`
  transform-origin: 0 0;
  height: 0px;
  width: 0px;
`;

export function Graph() {
  return (
    <$PanZoomTransformed>
      <NodeLayer />
      <EdgeLayer />
    </$PanZoomTransformed>
  );
}
