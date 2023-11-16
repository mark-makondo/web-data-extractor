import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';

// material ui
import Modal from '@material-ui/core/Modal';

// ui
import Navbar from './Navbar.js';

// components
import ProfileContainer from 'components/modals/profile/ProfileContainer';

// context
import Context from 'store/context/Context';
import { SocketContext } from 'store/context/SocketContext';
import { LogoutAction } from 'store/actions/authActions';

const NavbarContainer = ({ routes }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isHomeActive, setIsHomeActive] = useState(false);
    const [homeUrl, setHomeUrl] = useState();
    const [user, setUser] = useState(null);

    const {
        authState: {
            auth: { loading },
        },
        authDispatch,
        userState: {
            user: { data },
        },
    } = useContext(Context);

    const socket = useContext(SocketContext);

    let match, history;

    match = useRouteMatch();
    history = useHistory();

    //** SOCKET LISTENERS **//
    useEffect(() => {
        data && socket.emit('send_current_user', data);
    }, [socket, data]);

    //** PROFILE MODAL LOGIC **//
    const handleModalOpen = () => {
        setIsOpen(true);
    };

    const handleModalClose = () => {
        setIsOpen(false);
    };

    //** NAVBAR LOGIC **//
    const homeActive = useCallback(() => {
        let homeUrl, currentUrl;

        homeUrl = match.url;
        currentUrl = history.location.pathname;

        setHomeUrl(homeUrl);

        homeUrl === currentUrl ? setIsHomeActive(true) : setIsHomeActive(false);
    }, [history.location.pathname, match.url]);

    useEffect(() => {
        homeActive();
    }, [isHomeActive, homeActive]);

    useEffect(() => {
        setUser(data);
    }, [data]);

    const logoutClick = () => {
        LogoutAction(history)(authDispatch);
        data && socket.emit('send_current_user_logout', data._id);
    };

    return (
        <>
            <Navbar
                isHomeActive={isHomeActive}
                homeUrl={homeUrl}
                handleModalOpen={handleModalOpen}
                logoutClick={logoutClick}
                loading={loading}
                user={user}
                routes={routes}
            />
            <Modal open={isOpen} onClose={handleModalClose}>
                <ProfileContainer />
            </Modal>
        </>
    );
};

export default NavbarContainer;
