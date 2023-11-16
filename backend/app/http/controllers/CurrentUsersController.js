let currentUserHolder = [];

export const addUser = (user) => {
    return currentUserHolder.push(user);
};

export const removeUser = (id = null, sid = null) => {
    const newTemp = currentUserHolder.filter((data) => {
        if (id) return data._id !== id;
        if (sid) return data.sid !== sid;
    });

    return (currentUserHolder = [...newTemp]);
};

export const getAllUsers = () => currentUserHolder;

export const findWatcher = () =>
    currentUserHolder.find((data) => {
        if (data.role === 'watcher') return true;
        else return false;
    });
