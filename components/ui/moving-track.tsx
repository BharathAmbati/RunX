'use client';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

type MovingTrackProps = Omit<React.ComponentProps<'div'>, 'ref'>;

export function MovingTrack({ className, ...props }: MovingTrackProps) {
    const { theme } = useTheme();

    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<{
        scene: THREE.Scene;
        camera: THREE.PerspectiveCamera;
        renderer: THREE.WebGLRenderer;
        animationId: number;
        count: number;
    } | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Theme-aware colors
        const isDark = theme === 'dark';
        const trackColor = isDark ? 0x00ffff : 0x06b6d4; // cyan-400 for dark, brighter cyan-500 for light
        const fogColor = isDark ? 0x000000 : 0xffffff;

        // Scene setup
        const scene = new THREE.Scene();
        scene.fog = new THREE.Fog(fogColor, 100, 3000);

        const camera = new THREE.PerspectiveCamera(
            80,
            window.innerWidth / window.innerHeight,
            1,
            5000,
        );
        camera.position.set(0, 20, 50);
        camera.lookAt(0, 0, -500);

        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);

        containerRef.current.appendChild(renderer.domElement);

        // Create curves - Track style
        const NUM_LINES = 8; // Fewer lines for distinct track lanes
        const LINES_GROUP = new THREE.Group();

        const trackWidth = 800; // Narrower for more defined track
        const laneWidth = trackWidth / NUM_LINES;

        // We need the geometry to cover enough depth for the loop
        // Loop period: 2000 units
        const loopPeriod = 2000;
        const depth = loopPeriod * 2; // Generate 2 cycles
        const zStep = 8;

        for (let i = 0; i <= NUM_LINES; i++) {
            const points = [];
            const xBase = (i * laneWidth) - (trackWidth / 2);

            for (let z = 0; z > -depth; z -= zStep) {
                // Seamless curve: period must match loopPeriod
                // freq = 2 * PI / loopPeriod
                const freq = (Math.PI * 2) / loopPeriod;

                const curveX = Math.sin(z * freq) * 120; // Gentler curves
                const curveY = Math.cos(z * freq * 2) * 15;

                const x = xBase + curveX;
                const y = curveY - 30;
                points.push(new THREE.Vector3(x, y, z));
            }

            const geometry = new THREE.BufferGeometry().setFromPoints(points);

            // Lane marking style
            const material = new THREE.LineDashedMaterial({
                color: trackColor,
                linewidth: 2,
                scale: 1,
                dashSize: 40, // Longer dashes like lane markings
                gapSize: 30,
                transparent: true,
                opacity: isDark ? 30.0 : 1000.0, // More vibrant and visible
                blending: THREE.AdditiveBlending
            });

            const line = new THREE.Line(geometry, material);
            line.computeLineDistances(); // Required for DashedMaterial
            LINES_GROUP.add(line);
        }

        scene.add(LINES_GROUP);

        let count = 0;
        let animationId = 0;

        // Animation function
        const animate = () => {
            animationId = requestAnimationFrame(animate);

            // Move the track towards the camera - slower speed
            const speed = 6;
            LINES_GROUP.position.z += speed;

            // Seamless loop reset
            if (LINES_GROUP.position.z >= loopPeriod) {
                LINES_GROUP.position.z = 0;
            }

            renderer.render(scene, camera);
            count += 0.1;
        };

        // Handle window resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        // Start animation
        animate();

        // Store references
        sceneRef.current = {
            scene,
            camera,
            renderer,
            animationId,
            count,
        };

        // Cleanup function
        return () => {
            window.removeEventListener('resize', handleResize);

            if (sceneRef.current) {
                cancelAnimationFrame(sceneRef.current.animationId);

                // Dispose
                LINES_GROUP.traverse((obj) => {
                    if (obj instanceof THREE.Line) {
                        obj.geometry.dispose();
                        if (Array.isArray(obj.material)) {
                            obj.material.forEach(m => m.dispose());
                        } else {
                            obj.material.dispose();
                        }
                    }
                });

                sceneRef.current.renderer.dispose();

                if (containerRef.current && sceneRef.current.renderer.domElement) {
                    containerRef.current.removeChild(
                        sceneRef.current.renderer.domElement,
                    );
                }
            }
        };
    }, [theme]);

    return (
        <div
            ref={containerRef}
            className={cn('pointer-events-none absolute inset-0 z-0', className)}
            {...props}
        />
    );
}
