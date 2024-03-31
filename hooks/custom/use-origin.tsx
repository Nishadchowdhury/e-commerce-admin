// this hook is be used to access the window object 
/// next basically does server side rendering. On the server the window object doesn't exist.
//// it will prevent hydration errors.

import { useEffect, useState } from "react"

export const useOrigin = () => {

    const [mounted, setMounted] = useState(false);
    const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : "";

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return ""
    } else {
        return origin
    }

}
