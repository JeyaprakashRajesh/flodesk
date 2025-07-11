import React, { useRef, useEffect, useState } from "react";
import CanvasComponentLayer from "./components/CanvasComponentLayer";
import { ClockProps } from "./defaultProps.jsx";

const CANVAS_SIZE = 6000;
const GRID_SIZE = 20;

export default function Canvas({ project,projectId }) {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const panRef = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const [components, setComponents] = useState([]);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (project && project.components) {
      setComponents(project.components);
    }
  }, [project]);

  const clampPan = (x, y, wrapperWidth, wrapperHeight) => {
    const maxX = 100;
    const maxY = 100;
    const minX = wrapperWidth - CANVAS_SIZE - 100;
    const minY = wrapperHeight - CANVAS_SIZE - 100;

    return {
      x: Math.min(maxX, Math.max(minX, x)),
      y: Math.min(maxY, Math.max(minY, y)),
    };
  };

  const drawGrid = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { x: panX, y: panY } = panRef.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#cbd5e1";

    for (let x = -GRID_SIZE; x < CANVAS_SIZE + GRID_SIZE; x += GRID_SIZE) {
      for (let y = -GRID_SIZE; y < CANVAS_SIZE + GRID_SIZE; y += GRID_SIZE) {
        const screenX = x + panX;
        const screenY = y + panY;
        if (
          screenX >= 0 &&
          screenX <= canvas.width &&
          screenY >= 0 &&
          screenY <= canvas.height
        ) {
          ctx.beginPath();
          ctx.arc(screenX, screenY, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  };

  const animate = () => {
    drawGrid();
    setPan({ ...panRef.current });
    requestAnimationFrame(animate);
  };

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;

    canvas.width = wrapper.clientWidth;
    canvas.height = wrapper.clientHeight;

    const centerX = -CANVAS_SIZE / 2 + wrapper.clientWidth / 2;
    const centerY = -CANVAS_SIZE / 2 + wrapper.clientHeight / 2;
    panRef.current = { x: centerX, y: centerY };

    animate();

    const onMouseDown = (e) => {
      isDragging.current = true;
      dragStart.current = {
        x: e.clientX - panRef.current.x,
        y: e.clientY - panRef.current.y,
      };
    };

    const onMouseMove = (e) => {
      if (!isDragging.current) return;
      panRef.current = clampPan(
        e.clientX - dragStart.current.x,
        e.clientY - dragStart.current.y,
        wrapper.clientWidth,
        wrapper.clientHeight
      );
    };

    const stopDragging = () => {
      isDragging.current = false;
    };

    const onWheel = (e) => {
      if (e.ctrlKey) return;
      e.preventDefault();
      panRef.current = clampPan(
        panRef.current.x - e.deltaX,
        panRef.current.y - e.deltaY,
        wrapper.clientWidth,
        wrapper.clientHeight
      );
    };

    const onTouchStart = (e) => {
      if (e.touches.length === 2) {
        isDragging.current = true;
        dragStart.current = {
          x:
            (e.touches[0].clientX + e.touches[1].clientX) / 2 -
            panRef.current.x,
          y:
            (e.touches[0].clientY + e.touches[1].clientY) / 2 -
            panRef.current.y,
        };
      }
    };

    const onTouchMove = (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const avgX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const avgY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        panRef.current = clampPan(
          avgX - dragStart.current.x,
          avgY - dragStart.current.y,
          wrapper.clientWidth,
          wrapper.clientHeight
        );
      }
    };

    const onTouchEnd = () => {
      isDragging.current = false;
    };

    wrapper.addEventListener("mousedown", onMouseDown);
    wrapper.addEventListener("mousemove", onMouseMove);
    wrapper.addEventListener("mouseup", stopDragging);
    wrapper.addEventListener("mouseleave", stopDragging);
    wrapper.addEventListener("wheel", onWheel, { passive: false });

    wrapper.addEventListener("touchstart", onTouchStart, { passive: false });
    wrapper.addEventListener("touchmove", onTouchMove, { passive: false });
    wrapper.addEventListener("touchend", onTouchEnd);

    return () => {
      wrapper.removeEventListener("mousedown", onMouseDown);
      wrapper.removeEventListener("mousemove", onMouseMove);
      wrapper.removeEventListener("mouseup", stopDragging);
      wrapper.removeEventListener("mouseleave", stopDragging);
      wrapper.removeEventListener("wheel", onWheel);

      wrapper.removeEventListener("touchstart", onTouchStart);
      wrapper.removeEventListener("touchmove", onTouchMove);
      wrapper.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  const handleCenterView = () => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const centerX = -CANVAS_SIZE / 2 + wrapper.clientWidth / 2;
    const centerY = -CANVAS_SIZE / 2 + wrapper.clientHeight / 2;
    panRef.current = clampPan(
      centerX,
      centerY,
      wrapper.clientWidth,
      wrapper.clientHeight
    );
  };

  const handleAddClock = async () => {
    const wrapper = wrapperRef.current;
    const centerX = wrapper.clientWidth / 2 - panRef.current.x;
    const centerY = wrapper.clientHeight / 2 - panRef.current.y;

    const newComponent = {
      name: "Clock",
      props: {
        ...ClockProps,
        pos: { x: centerX, y: centerY },
      },
    };

    try {
      const token = localStorage.getItem("token"); // or sessionStorage

      const res = await fetch("http://localhost:8000/api/projects/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          projectId: projectId,
          component: newComponent,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setComponents((prev) => [...prev, data.component]);
      } else {
        console.error("Failed to add component:", data.message);
      }
    } catch (err) {
      console.error("Error adding component:", err);
    }
  };

  return (
    <div
      ref={wrapperRef}
      className="w-full h-screen overflow-hidden bg-white touch-none relative"
      style={{ touchAction: "none" }}
    >
      <canvas ref={canvasRef} className="absolute top-0 left-0" />
      <CanvasComponentLayer components={components} pan={pan} />

      <button
        onClick={handleAddClock}
        className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add Clock
      </button>

      <div className="absolute bottom-4 right-4 z-10">
        <button
          onClick={handleCenterView}
          className="bg-white px-4 py-2 rounded-lg shadow border border-gray-300 text-sm hover:bg-gray-50"
        >
          Center View
        </button>
      </div>
    </div>
  );
}
