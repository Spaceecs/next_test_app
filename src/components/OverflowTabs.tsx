'use client'

import React, { useState, useRef, useEffect } from "react";
import type { Tab } from "./Tab.type";

interface OverflowTabsProps {
    hiddenTabs: Tab[];
    onSelectTab: (url: string) => void;
}

export default function OverflowTabs({ hiddenTabs, onSelectTab }: OverflowTabsProps) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    if (hiddenTabs.length === 0) return null;

    return (
        <div ref={dropdownRef} style={{ position: "relative" , zIndex: 10000}}>
            <button
                onClick={() => setOpen(!open)}
                aria-haspopup="true"
                aria-expanded={open}
                aria-label="Показати приховані вкладки"
                type="button"
                style={{
                    width: 30,
                    height: 30,
                    cursor: "pointer",
                    userSelect: "none",
                    fontSize: 20,
                    background: "none",
                    border: "1px solid #ccc",
                    borderRadius: 4,
                }}
            >
                ⋯
            </button>

            {open && (
                <ul
                    style={{
                        position: "absolute",
                        top: "100%",
                        right: 0,
                        background: "white",
                        border: "1px solid #ccc",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        listStyle: "none",
                        margin: 0,
                        padding: "4px 0",
                        minWidth: 120,
                        zIndex: 100,
                    }}
                >
                    {hiddenTabs.map((tab) => (
                        <li key={tab.id} style={{ padding: "4px 12px" }}>
                            <button
                                style={{
                                    width: "100%",
                                    textAlign: "left",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    padding: "4px 0",
                                }}
                                onClick={() => {
                                    onSelectTab(tab.url);
                                    setOpen(false);
                                }}
                            >
                                {tab.title}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
