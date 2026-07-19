type Listener = () => void;

class EventBus {

    private listeners =
        new Map<string, Set<Listener>>();

    on(
        event: string,
        listener: Listener
    ) {

        if (!this.listeners.has(event)) {
            this.listeners.set(
                event,
                new Set()
            );
        }

        this.listeners
            .get(event)!
            .add(listener);

        return () => {
            this.listeners
                .get(event)
                ?.delete(listener);
        };
    }

    emit(event: string) {
        this.listeners.get(event)?.forEach(listener => listener());
    }

}

export const eventBus = new EventBus();