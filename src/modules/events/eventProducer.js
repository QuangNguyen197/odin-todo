export function triggerCustomEvent(domElement, eventName, data = null) {
    const event = new CustomEvent(eventName, {
        detail: { data },
        bubbles: true
    });

    domElement.dispatchEvent(event);
}