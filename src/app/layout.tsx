import "./globals.css";
import TabsContainer from "@/components/TabsContainer";

export default function TabsLayout({ children }: { children: React.ReactNode }) {
    return (
        <html>
            <TabsContainer />
            <body >
                {children}
            </body>
        </html>
    );
}