'use client'
import "./globals.css";
import TabsContainer from "@/components/TabsContainer";
import React from "react";

export default function TabsLayout({ children }: { children: React.ReactNode }) {
    return (
        <html>
            <body >
            <TabsContainer />
                {children}
            </body>
        </html>
    );
}