// src/components/StarfieldBackground.jsx
import { useEffect, useRef } from 'react';

function StarfieldBackground() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        let stars = [];
        const numStars = 200;

        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 1.5,
                vx: Math.floor(Math.random() * 50) - 25,
                vy: Math.floor(Math.random() * 50) - 25
            });
        }

        function draw() {
            ctx.clearRect(0, 0, width, height);
            ctx.globalCompositeOperation = "lighter";

            for (let i = 0, x = stars.length; i < x; i++) {
                let s = stars[i];
                ctx.fillStyle = "#fff";
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.radius, 0, 2 * Math.PI);
                ctx.fill();
            }
        }

        function update() {
            for (let i = 0, x = stars.length; i < x; i++) {
                let s = stars[i];
                s.x += s.vx / 60;
                s.y += s.vy / 60;

                if (s.x < 0 || s.x > width) s.vx = -s.vx;
                if (s.y < 0 || s.y > height) s.vy = -s.vy;
            }
        }

        let animationFrameId;
        function tick() {
            draw();
            update();
            animationFrameId = requestAnimationFrame(tick);
        }

        tick();

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return <canvas ref={canvasRef} id="starfield-background"></canvas>;
}

export default StarfieldBackground;
