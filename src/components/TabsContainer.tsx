'use client'

import React, { useEffect, useState, useRef } from "react";
import TabItem from "./TabItem";
import SortableTabItem from "./SortableTabItem";
import OverflowTabs from "./OverflowTabs";
import { usePathname, useRouter } from "next/navigation";
import type { Tab } from "./Tab.type";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

const LOCAL_STORAGE_KEY = "tabs_state";

const defaultTabs: Tab[] = [
    { id: "1", title: "Tab 1", icon: "📄", url: "/tabs/tab1", pinned: true },
    { id: "2", title: "Tab 2", icon: "📄", url: "/tabs/tab2", pinned: false },
    { id: "3", title: "Tab 3", icon: "📄", url: "/tabs/tab3", pinned: false },
    { id: "4", title: "Tab 4", icon: "📄", url: "/tabs/tab4", pinned: false },
    { id: "5", title: "Tab 5", icon: "📄", url: "/tabs/tab5", pinned: false },
];

export default function TabsContainer() {
    const router = useRouter();
    const pathname = usePathname();
    const containerRef = useRef<HTMLDivElement>(null);

    const [tabs, setTabs] = useState<Tab[]>(() => {
        if (typeof window === "undefined") return defaultTabs;
        try {
            const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
            return stored ? JSON.parse(stored) : defaultTabs;
        } catch {
            return defaultTabs;
        }
    });

    const [visibleTabs, setVisibleTabs] = useState<Tab[]>([]);
    const [hiddenTabs, setHiddenTabs] = useState<Tab[]>([]);

    useEffect(() => {
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tabs));
        } catch {}
        calculateVisibleTabs();
    }, [tabs]);

    function calculateVisibleTabs() {
        if (!containerRef.current) {
            setVisibleTabs(tabs);
            setHiddenTabs([]);
            return;
        }

        const containerWidth = containerRef.current.offsetWidth;
        const pinnedTabs = tabs.filter((t) => t.pinned);
        const unpinnedTabs = tabs.filter((t) => !t.pinned);

        const TAB_WIDTH = 120;
        const OVERFLOW_BUTTON_WIDTH = 40;

        let usedWidth = pinnedTabs.length * TAB_WIDTH;
        let visibleUnpinned: Tab[] = [];
        let hiddenUnpinned: Tab[] = [];

        // Спочатку припускаємо, що overflow кнопки немає
        for (const tab of unpinnedTabs) {
            if (usedWidth + TAB_WIDTH <= containerWidth) {
                visibleUnpinned.push(tab);
                usedWidth += TAB_WIDTH;
            } else {
                hiddenUnpinned.push(tab);
            }
        }

        // Якщо є приховані таби, враховуємо місце під кнопку overflow
        if (hiddenUnpinned.length > 0) {
            let adjustedWidth = containerWidth - OVERFLOW_BUTTON_WIDTH;

            visibleUnpinned = [];
            hiddenUnpinned = [];
            usedWidth = pinnedTabs.length * TAB_WIDTH;

            for (const tab of unpinnedTabs) {
                if (usedWidth + TAB_WIDTH <= adjustedWidth) {
                    visibleUnpinned.push(tab);
                    usedWidth += TAB_WIDTH;
                } else {
                    hiddenUnpinned.push(tab);
                }
            }
        }

        setVisibleTabs([...pinnedTabs, ...visibleUnpinned]);
        setHiddenTabs(hiddenUnpinned);
    }

    useEffect(() => {
        window.addEventListener("resize", calculateVisibleTabs);
        return () => window.removeEventListener("resize", calculateVisibleTabs);
    }, [tabs]);

    const sensors = useSensors(useSensor(PointerSensor));

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const pinnedTabs = tabs.filter((t) => t.pinned);
        const unpinnedTabs = tabs.filter((t) => !t.pinned);

        const oldIndex = unpinnedTabs.findIndex((t) => t.id === active.id);
        const newIndex = unpinnedTabs.findIndex((t) => t.id === over.id);

        if (oldIndex === -1 || newIndex === -1) return;

        const reordered = arrayMove(unpinnedTabs, oldIndex, newIndex);
        setTabs([...pinnedTabs, ...reordered]);
    };

    const togglePin = (id: string) => {
        const updatedTabs = tabs.map((tab) =>
            tab.id === id ? { ...tab, pinned: !tab.pinned } : tab
        );
        const sortedTabs = [...updatedTabs].sort((a, b) =>
            a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1
        );
        setTabs(sortedTabs);
    };

    const handleTabClick = (url: string) => {
        router.push(url);
    };

    const pinned = visibleTabs.filter((t) => t.pinned);
    const unpinnedVisible = visibleTabs.filter((t) => !t.pinned);

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <div
                ref={containerRef}
                style={{
                    display: "flex",
                    overflow: "hidden",
                    alignItems: "center",
                    gap: "4px",
                    width: "100%",
                    position: "relative",
                    padding: "4px",
                    borderBottom: "1px solid #ccc",
                    background: "#fafafa",
                    userSelect: "none",
                }}
            >
                {pinned.map((tab) => (
                    <TabItem
                        key={tab.id}
                        title={tab.title}
                        icon={tab.icon}
                        url={tab.url}
                        pinned={tab.pinned}
                        active={pathname === tab.url}
                        onClick={() => handleTabClick(tab.url)}
                        onTogglePin={() => togglePin(tab.id)}
                        draggable={false}
                    />
                ))}

                <SortableContext
                    items={unpinnedVisible.map((t) => t.id)}
                    strategy={horizontalListSortingStrategy}
                >
                    {unpinnedVisible.map((tab) => (
                        <SortableTabItem
                            id={tab.id}
                            key={tab.id}
                            title={tab.title}
                            icon={tab.icon}
                            url={tab.url}
                            pinned={tab.pinned}
                            active={pathname === tab.url}
                            onClick={() => handleTabClick(tab.url)}
                            onTogglePin={() => togglePin(tab.id)}
                            draggable={true}
                        />
                    ))}
                </SortableContext>

                <OverflowTabs hiddenTabs={hiddenTabs} onSelectTab={handleTabClick} />
            </div>
        </DndContext>
    );
}
