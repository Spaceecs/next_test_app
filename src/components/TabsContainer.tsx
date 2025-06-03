'use client'
import React, { useEffect, useState, useRef } from "react";
import TabItem from "@/components/TabItem";
import SortableTabItem from "@/components/SortableTabItem";
import OverflowTabs from "@/components/OverflowTabs";
import { usePathname, useRouter } from "next/navigation";
import type { Tab } from "@/components/Tab.type";
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

const defaultTabs: Tab[] = [
    { id: "1", title: "Tab 1", icon: "tab-1", url: "/tabs/tab1", pinned: true },
    { id: "2", title: "Tab 2", icon: "tab-2", url: "/tabs/tab2", pinned: false },
    { id: "3", title: "Tab 3", icon: "tab-3", url: "/tabs/tab3", pinned: false },
    { id: "4", title: "Tab 4", icon: "tab-4", url: "/tabs/tab4", pinned: false },
    { id: "5", title: "Tab 5", icon: "tab-5", url: "/tabs/tab5", pinned: false },
];

const LOCAL_STORAGE_KEY = "tabs_state";

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
    const [visibleTabs, setVisibleTabs] = useState<Tab[]>(tabs);
    const [hiddenTabs, setHiddenTabs] = useState<Tab[]>([]);

    useEffect(() => {
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tabs));
        } catch {
            console.log("Error");
        }
    }, [tabs]);

    const togglePin = (id: string) => {
        const updatedTabs = tabs.map((tab) =>
            tab.id === id ? { ...tab, pinned: !tab.pinned } : tab
        );
        const sortedTabs = [...updatedTabs].sort((a, b) =>
            a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1
        );
        setTabs(sortedTabs);
    };

    // Drag & drop
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

    const handleTabClick = (url: string) => {
        router.push(url);
    };

    useEffect(() => {
        function updateVisibleTabs() {
            if (!containerRef.current) return;

            const containerWidth = containerRef.current.offsetWidth;
            const children = Array.from(containerRef.current.children);
            let usedWidth = 0;
            const visible: Tab[] = [];
            const hidden: Tab[] = [];

            const pinnedTabs = tabs.filter((t) => t.pinned);
            const unpinnedTabs = tabs.filter((t) => !t.pinned);

            pinnedTabs.forEach((tab) => visible.push(tab));

            for (const tab of unpinnedTabs) {
                const estimatedWidth = 100;
                if (usedWidth + estimatedWidth < containerWidth - 50) {
                    visible.push(tab);
                    usedWidth += estimatedWidth;
                } else {
                    hidden.push(tab);
                }
            }

            setVisibleTabs(visible);
            setHiddenTabs(hidden);
        }

        updateVisibleTabs();

        window.addEventListener("resize", updateVisibleTabs);
        return () => window.removeEventListener("resize", updateVisibleTabs);
    }, [tabs]);

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
