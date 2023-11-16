// antd
import { notification } from 'antd';

/**
 *
 * @param {String} type success || error || info || warning || warn
 * @param {String} position topLeft || topRight || bottomLeft || bottomRight
 * @param {String} title notification title
 * @param {String} description notification message
 * @returns
 */
const notificationHolder = (type, position, title, description, duration = 4.5) => {
    return notification[type]({
        placement: position,
        message: title,
        description: description,
        duration,
    });
};

export default notificationHolder;
