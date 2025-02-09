import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function MovableCanvas({ data, setData }) {
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [scale] = useState(1); 
  const [position, setPosition] = useState({ x: 0, y: 0 }); 
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const canvasSize = { width: 4000, height: 3000 };

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

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  
  const handleWheel = (e) => {
    if (e.shiftKey) {
      setPosition((prev) => ({
        x: prev.x - e.deltaY * 2, 
        y: prev.y,
      }));
    } else if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      setPosition((prev) => ({
        x: prev.x - e.deltaX * 2,
        y: prev.y,
      }));
    } else {
      setPosition((prev) => ({
        x: prev.x,
        y: prev.y - e.deltaY * 2,
      }));
    }
    e.preventDefault(); 
  };
  

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
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
        
        <div className="canvas-content">🎨 Your Editable Canvas 🎨</div>
      </motion.div>
    </div>
  );
}
