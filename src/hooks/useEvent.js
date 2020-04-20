import { useEffect } from "react";
//hooks qui permet d'utiliser les évenements javascript
export default function useEvent(event, handler, passive = false) {
    useEffect(() => {
        // initiate the event handler
        window.addEventListener(event, handler, passive);

        // this will clean up the event every time the component is re-rendered
        return function cleanup() {
            window.removeEventListener(event, handler);
        };
    });
}
