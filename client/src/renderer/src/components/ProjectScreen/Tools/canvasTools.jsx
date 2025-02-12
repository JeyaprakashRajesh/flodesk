import React, { useState, useEffect } from "react";

export default function CanvasTools({ element, setData }) {
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [localPosition, setLocalPosition] = useState({
    x: element.props?.position?.x || 0,
    y: element.props?.position?.y || 0,
  });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;

      const newX = e.clientX - offset.x;
      const newY = e.clientY - offset.y;

      setLocalPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      if (!isDragging) return;
      setIsDragging(false);

      setData((prevData) => ({
        ...prevData,
        elements: prevData.elements.map((el) =>
          el.id === element.id
            ? { ...el, props: { ...el.props, position: { x: localPosition.x, y: localPosition.y } } }
            : el
        ),
      }));

      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, offset, localPosition, setData, element.id]);

  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Only left-click

    setIsDragging(true);

    setOffset({
      x: e.clientX - localPosition.x,
      y: e.clientY - localPosition.y,
    });

    e.stopPropagation();
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      style={{
        position: "absolute",
        left: localPosition.x + 2000,
        top: localPosition.y + 1500,
        backgroundColor: "lightblue",
        padding: "10px",
        borderRadius: "5px",
        color: "black",
        cursor: isDragging ? "grabbing" : "grab",
        userSelect: "none",
      }}
    >
      {element.name || "Unnamed Element"}
    </div>
  );
}
