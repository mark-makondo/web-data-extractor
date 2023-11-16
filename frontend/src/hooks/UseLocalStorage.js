const { useEffect, useState } = require('react');

export const UseLocalStorage = (defaultValue, key) => {
    const [value, setValue] = useState(() => {
        const localValue = window.localStorage.getItem(key);

        return (localValue !== null) & (localValue && localValue.length !== 0) ? JSON.parse(localValue) : defaultValue;
    });

    useEffect(() => {
        window.localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
};
