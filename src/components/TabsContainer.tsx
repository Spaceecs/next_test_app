'use client'
import TabItem from "@/components/TabItem";
import {usePathname, useRouter} from "next/navigation";
import type {Tab} from "@/components/Tab.type";

const Tabs: Tab[] = [
    {id: "1", title: "Tab 1", icon: "tab-1", url: "/tabs/tab1", pinned: true},
    {id: "2", title: "Tab 2", icon: "tab-2", url: "/tabs/tab2", pinned: true},
    {id: "3", title: "Tab 3", icon: "tab-3", url: "/tabs/tab3", pinned: false},
    {id: "4", title: "Tab 4", icon: "tab-4", url: "/tabs/tab4", pinned: false},
    {id: "5", title: "Tab 5", icon: "tab-5", url: "/tabs/tab5", pinned: false},
];


export default function TabsContainer() {
    const router = useRouter();
    const pathname = usePathname();

    const handleTabClick = (id: string) => {
        router.push(id);
    }

    return(
        <div style={{display: 'flex'}}>
            {Tabs.map(tab => (
                <TabItem
                    key={tab.id}
                    title={tab.title}
                    icon={tab.icon}
                    url={tab.url}
                    pinned={tab.pinned}
                    active={pathname === tab.url}
                    onClick={() => handleTabClick(tab.url)}
                />
            ))}
        </div>
    )
}