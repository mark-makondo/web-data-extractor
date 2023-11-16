import React, { useContext, useState } from 'react';

// material ui
import Modal from '@material-ui/core/Modal';

// ui
import Home from './Home.js';

// components
import ProfileContainer from '../../components/modals/profile/ProfileContainer.js';

// context
import Context from 'store/context/Context';

const HomeContainer = () => {
    const [isOpen, setIsOpen] = useState(false);

    const {
        userState: {
            user: { data },
        },
    } = useContext(Context);

    const handleModalOpen = () => {
        setIsOpen(true);
    };

    const handleModalClose = () => {
        setIsOpen(false);
    };

    return (
        <>
            <Home handleModalOpen={handleModalOpen} user={data} />
            <Modal open={isOpen} onClose={handleModalClose}>
                <ProfileContainer />
            </Modal>
        </>
    );
};

export default HomeContainer;
