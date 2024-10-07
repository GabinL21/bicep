import type { D3DragEvent, SubjectPosition } from "d3-drag";
import type { PrimitiveAtom } from "jotai";

import { useGetPanZoomTransform } from "@vscode-bicep-ui/components";
import { drag } from "d3-drag";
import { select } from "d3-selection";
import { animate, frame, transform } from "framer-motion";
import { useStore } from "jotai";
import { useEffect, useRef } from "react";
import { styled } from "styled-components";

type NodeProps = {
  id: string;
  originAtom: PrimitiveAtom<{
    x: number;
    y: number;
  }>;
  boxAtom: PrimitiveAtom<{
    center: {
      x: number;
      y: number;
    };
    width: number;
    height: number;
  }>;
};

const $Node = styled.div`
  position: absolute;
  cursor: default;
  display: flex;
  justify-content: center;
  align-items: center;
  transform-origin: 0 0;
  background: #1f1f1f1f;
  border-style: solid;
  border-color: black;
  z-index: 1;
`;

export function PrimitiveNode({ id, originAtom, boxAtom }: NodeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const store = useStore();
  const getPanZoomTransform = useGetPanZoomTransform();

  useEffect(() => {
    return store.sub(originAtom, () => {
      const origin = store.get(originAtom);
      const { center } = store.get(boxAtom);

      if (origin.x === center.x && origin.y === center.y) {
        return;
      }
      const xTransform = transform([0, 100], [center.x, origin.x])
      const yTransform = transform([0, 100], [center.y, origin.y]);

      animate(0, 100, {
        type: "spring",
        duration: 0.4,
        onUpdate: (latest) => {
          const x = xTransform(latest);
          const y = yTransform(latest);

          frame.update(() => {
            store.set(boxAtom, (box) => ({
              ...box,
              center: { x, y },
            }));
          });
        },
      });
    });
  }, [boxAtom, originAtom, store]);

  useEffect(() => {
    const updateBox = () => {
      if (!ref.current) {
        return;
      }
      const { center, width, height } = store.get(boxAtom);

      ref.current.style.translate = `${center.x - width / 2}px ${center.y - height / 2}px`;
      ref.current.style.width = `${width}px`;
      ref.current.style.height = `${height}px`;
    };

    updateBox();

    return store.sub(boxAtom, () => updateBox());
  }, [boxAtom, store]);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const selection = select(ref.current);
    const dragBehavior = drag<HTMLDivElement, unknown>().on(
      "drag",
      ({ dx, dy }: D3DragEvent<HTMLDivElement, unknown, SubjectPosition>) => {
        const { scale } = getPanZoomTransform();

        frame.update(() => {
          store.set(boxAtom, (box) => ({
            ...box,
            center: {
              x: box.center.x + dx / scale,
              y: box.center.y + dy / scale,
            },
          }));
        });
      },
    );

    selection.call(dragBehavior);

    return () => {
      selection.on("drag", null);
    };
  }, [boxAtom, getPanZoomTransform, store]);

  return <$Node ref={ref}>{id}</$Node>;
}