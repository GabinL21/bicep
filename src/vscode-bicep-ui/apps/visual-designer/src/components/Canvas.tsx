import { useSetAtom } from "jotai";
import { useEffect, useRef } from "react";
import { styled } from "styled-components";
import { clearPanZoomGesturesAtom, setPanZoomGesturesAtom } from "../atoms/panZoom";
import { Graph } from "./Graph";

const $Canvas = styled.div`
  position: absolute;
  left: 0px;
  top: 0px;
  right: 0px;
  bottom: 0px;
  overflow: hidden;
`;

export function Canvas() {
  const ref = useRef<HTMLDivElement>(null);
  const setPanZoomGestures = useSetAtom(setPanZoomGesturesAtom);
  const clearPanZoomGestures = useSetAtom(clearPanZoomGesturesAtom);

  useEffect(() => {
    if (ref.current) {
      setPanZoomGestures(ref.current);
    }

    return () => {
      clearPanZoomGestures();
    };
  }, [clearPanZoomGestures, setPanZoomGestures]);

  return (
    <$Canvas ref={ref}>
      <Graph />
    </$Canvas>
  );
}
