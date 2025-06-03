import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TabItem from "./TabItem";
import type { Tab } from "./Tab.type";

type Props = Tab & {
    active: boolean;
    onClick: () => void;
    onTogglePin: () => void;
    draggable: boolean;
    dragListeners?: any;
    dragAttributes?: any;
};

export default function SortableTabItem(props: Props) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: props.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style}>
            <TabItem
                {...props}
                draggable
                dragListeners={listeners}
                dragAttributes={attributes}
            />
        </div>
    );
}
