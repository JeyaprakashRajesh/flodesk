import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

const CanvasItem = ({ type, position, content, scale }) => {
  return (
    <div
      className="canvas-item"
      style={{
        position: "absolute",
        left: position.x + 2000, // Centering elements
        top: position.y + 1500,  // Centering elements
        transform: `scale(${scale})`,
        transformOrigin: "left left",
      }}
    >
      {type === "clock" && <Clock />}
      {type === "timer" && <Timer />}
      {type === "note" && <Note content={content} />}
    </div>
  );
};

const Clock = () => <div className="clock">🕒 {new Date().toLocaleTimeString()}</div>;
const Timer = () => <div className="timer">⏳ Timer: 00:30</div>;
const Note = ({ content }) => <div className="note">{content}</div>;

export default function MovableCanvas({ data, setData }) {
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [scale] = useState(1); // Set scale to 1 permanently
  const [position, setPosition] = useState({ x: 0, y: 0 }); // Set initial position to (2000, 1500)
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const canvasSize = { width: 4000, height: 3000 };
  const elements = [
    { id: 1, type: "clock", position: { x: 0, y: 0 } },
    { id: 2, type: "timer", position: { x: 30, y: 20 } },
    { id: 3, type: "note", position: { x: -300, y: -300 }, content: "Meeting at 3 PM" }
  ];

  useEffect(() => {
    const updateContainerSize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setContainerSize({ width: clientWidth, height: clientHeight });
      }
    };

    updateContainerSize();
    window.addEventListener("resize", updateContainerSize);
    return () => window.removeEventListener("resize", updateContainerSize);
  }, []);

  // Handle mouse down event to start dragging
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  // Handle mouse move event to drag the canvas
  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  // Handle mouse up event to stop dragging
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle wheel scroll event to move the canvas
  const handleWheel = (e) => {
    if (e.shiftKey) {
      // Horizontal scrolling when Shift key is pressed
      setPosition((prev) => ({
        x: prev.x - e.deltaY * 2, // Use deltaY instead of deltaX for better shift-scroll behavior
        y: prev.y,
      }));
    } else if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      // Normal horizontal scrolling (when deltaX is dominant)
      setPosition((prev) => ({
        x: prev.x - e.deltaX * 2,
        y: prev.y,
      }));
    } else {
      // Vertical scrolling
      setPosition((prev) => ({
        x: prev.x,
        y: prev.y - e.deltaY * 2,
      }));
    }
    e.preventDefault(); // Prevent default page scrolling
  };
  
  

  // Add event listeners for mouse drag and wheel scroll
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousedown", handleMouseDown);
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseup", handleMouseUp);
      container.addEventListener("mouseleave", handleMouseUp); // Stop dragging when mouse leaves container
      container.addEventListener("wheel", handleWheel, { passive: false }); // Add wheel scroll handler
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
  }, [isDragging, dragStart, position]);

  return (
    <div
      className="canvas-outer-container"
      ref={containerRef}
      style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative" }}
    >
      <motion.div
        className="canvas"
        animate={{ x: position.x, y: position.y, scale }}
        style={{
          width: canvasSize.width,
          height: canvasSize.height,
          backgroundColor: data.backgroundcolor,
          position: "absolute",
        }}
      >
        {elements.map((item) => (
          <CanvasItem
            key={item.id}
            type={item.type}
            position={item.position}
            content={item.content}
            scale={scale}
          />
        ))}
        <div className="canvas-content">🎨 Your Editable Canvas 🎨</div>
      </motion.div>
    </div>
  );
}
