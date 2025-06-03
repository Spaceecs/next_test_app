import { Tab } from './Tab.type';
import styles from '../styles/TabItem.module.css';

interface TabItemProps extends Pick<Tab, 'title' | 'icon' | 'url' | 'pinned'> {
    active: boolean;
    onClick: () => void;
    onTogglePin: () => void;
    draggable?: boolean;
    dragListeners?: any;
    dragAttributes?: any;
}

export default function TabItem({
                                    title,
                                    icon,
                                    active,
                                    onClick,
                                    onTogglePin,
                                    pinned,
                                    draggable,
                                    dragListeners,
                                    dragAttributes,
                                }: TabItemProps) {
    return (
        <div className={styles.tabButtonContainer} style={{ cursor: draggable ? "default" : "pointer" }}>
            <span {...dragListeners} {...dragAttributes} className={`${styles.tabButton} ${active ? styles.tabButtonActive : ''}`}>
                {icon}
            </span>
            <button
                onClick={onClick}
                className={`${styles.tabButton} ${active ? styles.tabButtonActive : ''}`}
                type="button"
            >
                {title}
            </button>
            <button
                className={`${styles.tabButton} ${active ? styles.tabButtonActive : ''}`}
                onClick={onTogglePin}
            >
                {pinned ? "u" : "p"}
            </button>
        </div>
    );
}
