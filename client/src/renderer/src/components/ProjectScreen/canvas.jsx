import React, { useRef, useEffect, useState } from "react";
import { io } from "socket.io-client";
import CanvasTools from "./Tools/canvasTools";

const socket = io("http://localhost:3000");

const MovableCanvas = ({ data, setData }) => {
  const containerRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isCanvasDragging, setIsCanvasDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const canvasSize = { width: 4000, height: 3000 };

  // Center canvas on load
  useEffect(() => {
    const centerX = (window.innerWidth - canvasSize.width) / 2;
    const centerY = (window.innerHeight - canvasSize.height) / 2;
    setPosition({ x: centerX, y: centerY });
  }, []);

  useEffect(() => {
    const container = containerRef.current;

    const handleMouseDown = (e) => {
      // Right-click to move the canvas
      if (e.button === 2) {
        setIsCanvasDragging(true);
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
      }
    };

    const handleMouseMove = (e) => {
      if (isCanvasDragging) {
        setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
      }
    };

    const handleMouseUp = () => {
      setIsCanvasDragging(false);
    };

    const handleWheel = (e) => {
      setPosition((prev) => ({
        x: prev.x - (e.shiftKey ? e.deltaY * 2 : e.deltaX * 2),
        y: prev.y - (!e.shiftKey ? e.deltaY * 2 : 0),
      }));
      e.preventDefault();
    };

    if (container) {
      container.addEventListener("contextmenu", (e) => e.preventDefault()); // Disable right-click menu
      container.addEventListener("mousedown", handleMouseDown);
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseup", handleMouseUp);
      container.addEventListener("mouseleave", handleMouseUp);
      container.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener("mousedown", handleMouseDown);
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseup", handleMouseUp);
        container.removeEventListener("mouseleave", handleMouseUp);
        container.removeEventListener("wheel", handleWheel);
      }
    };
  }, [isCanvasDragging, dragStart, position]);

  useEffect(() => {
    socket.on("elementCreated", (response) => {
      console.log("Element added:", response);
      if (response.success && response.project) {
        setData(response.project);
      }
    });

    return () => {
      socket.off("elementCreated");
    };
  }, [setData]);

  return (
    <div
      className="canvas-outer-container"
      ref={containerRef}
      style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative" }}
    >
      <div
        className="canvas"
        style={{
          width: canvasSize.width,
          height: canvasSize.height,
          backgroundColor: data.backgroundcolor,
          position: "absolute",
          left: position.x,
          top: position.y,
        }}
      >
        {Array.isArray(data.elements) &&
          data.elements.map((element, index) => (
            <CanvasTools element={element} key={index} setData={setData} />
          ))}
      </div>
    </div>
  );
};

export default MovableCanvas;
