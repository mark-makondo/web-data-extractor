import React from 'react';
import { NavLink } from 'react-router-dom';

// material ui
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

// components
import Logo from 'components/logo/Logo.js';

// helper
import { getNameInitials } from 'helper/functions.js';

const Navbar = (props) => {
    let { isHomeActive, homeUrl, handleModalOpen, logoutClick, user, loading, routes } = props;

    let initials = getNameInitials(user?.firstname, user?.lastname);

    return (
        <nav className="page-navbar">
            <Logo />
            <div className="page-navbar__middle">
                <div className="page-navbar__avatar" onClick={(e) => handleModalOpen(e)}>
                    {user ? (
                        <Avatar className="page-navbar__avatar-img" children={initials} src={user && user.avatar} />
                    ) : (
                        <CircularProgress className="page-navbar-loading" disableShrink color="primary" />
                    )}
                </div>

                <NavLink
                    activeClassName={isHomeActive ? 'page-navbar--selected' : ''}
                    className="normal-3"
                    to={`${homeUrl}`}
                >
                    Home
                </NavLink>

                {routes.map((route, i) => (
                    <NavLink
                        key={`${route.title}-${i}`}
                        activeClassName={'page-navbar--selected'}
                        className="normal-3"
                        to={route.path}
                    >
                        {route.title}
                    </NavLink>
                ))}
            </div>
            <div className="page-navbar__logout">
                {loading ? (
                    <CircularProgress sizes="small" className="page-navbar-loading" disableShrink color="primary" />
                ) : (
                    <Button onClick={(e) => logoutClick(e)} className="normal-3">
                        Logout
                    </Button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
