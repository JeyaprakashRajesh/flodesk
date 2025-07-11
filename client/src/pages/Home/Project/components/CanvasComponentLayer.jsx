import React from "react";
import ClockWidget from "./widgets/Clock";

export default function CanvasComponentLayer({ components, pan }) {
  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
      {components.map((comp) => {
        const { pos = { x: 0, y: 0 } } = comp.props;
        const screenX = pos.x + pan.x;
        const screenY = pos.y + pan.y;

        return (
          <div
            key={comp.id}
            className="absolute"
            style={{
              left: `${screenX}px`,
              top: `${screenY}px`,
              pointerEvents: "auto",
            }}
          >
            {comp.name === "Clock" ? (
              <ClockWidget {...comp.props} />
            ) : (
              <div className="bg-gray-200 p-4 rounded shadow">
                <p className="text-sm text-gray-700">{comp.name}</p>
                <p className="text-xs text-gray-500">
                  x: {pos.x}, y: {pos.y}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

