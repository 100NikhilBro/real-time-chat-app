import { useEffect, useState } from 'react';


// isko thodha padh lena 

const useDebounce = (value, delay = 500) => {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debounced;
};

export default useDebounce;