import { RelativePathString, usePathname, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';

const router = useRouter();
const pathname = usePathname();
const history = useRef<string[]>([]);

useEffect(() => {
    if (history.current[history.current.length - 1] !== pathname) {
        history.current.push(pathname);
    }
}, [pathname]);

export const customBack = () => {
    if (history.current.length > 1) {
        history.current.pop();
        const previousRoute = history.current[history.current.length - 1];
        router.navigate(previousRoute as RelativePathString);
    } else {
        router.navigate('/');
    }
};

