import { Tab } from './Tab.type';
import styles from '../styles/TabItem.module.css';

interface TabItemProps extends Pick<Tab, 'title' | 'icon' | 'url' | 'pinned'> {
    active: boolean;
    onClick: () => void;
}

export default function TabItem({ title, icon, active, onClick }: TabItemProps) {
    return (
        <button
            onClick={onClick}
            className={`${styles.tabButton} ${active ? styles.tabButtonActive : ''}`}
            type="button"
        >
            {icon} {title}
        </button>
    );
}
