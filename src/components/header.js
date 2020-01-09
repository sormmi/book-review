import { Link, navigate } from "gatsby";
import PropTypes from "prop-types";
import React, { useContext } from "react";
import { FirebaseContext } from "../firebase";
import styled from "styled-components";

const LoginLink = styled(Link)`
  cursor: pointer;
  color: white;
  text-decoration: none;

  &:hover {
    text-shadow: 0px 0px 30px white;
  }
`;

const LogoutLink = styled.span`
  cursor: pointer;
  color: white;

  &:hover {
    text-decoration: underline;
  }
`;

const HeaderWrapper = styled.header`
  background: rebeccapurple;
  margin-bottom: 1.45rem;
`;

const HeaderContent = styled.div`
  margin: 0 auto;
  max-width: 960px;
  padding: 0.8rem 1.0875rem;
  display: flex;

  > h1 {
    margin: 0;
    flex-grow: 1;
    font-size: 1.5em;
  }

  > div {
    margin: auto 0;
    font-size: 0.9em;
  }

  a {
    color: white;
    text-decoration: none;
  }
`;

const UserInfo = styled.span`
  color: white;
  font-weight: bolder;
`;

const Divider = styled.span`
  margin: 0 8px;
  padding-right: 1px;
  background: #ddd;
`;

const Header = ({ siteTitle }) => {
  const { firebase, user } = useContext(FirebaseContext);

  const handleLogout = async () => {
    await firebase.logout();
    navigate("/login");
  };

  return (
    <HeaderWrapper>
      <HeaderContent>
        <h1>
          <Link to="/">{siteTitle}</Link>
        </h1>
        <div>
          {user && user.email && (
            <>
              <UserInfo>Terve, {user.username || user.email}</UserInfo>
              <Divider />
              {user.isAdmin && (
                <>
                  <Link to="/add-author">Uusi kirjailija</Link>
                  <Divider />
                  <Link to="/add-book">Uusi kirja</Link>
                  <Divider />
                </>
              )}
              <LogoutLink onClick={handleLogout}>Kirjaudu ulos</LogoutLink>
            </>
          )}
          {(!user || !user.email) && (
            <>
              <LoginLink to="/login">Kirjaudu sisään</LoginLink>
              <Divider />
              <LoginLink to="/register">Rekisteröidy</LoginLink>
            </>
          )}
        </div>
      </HeaderContent>
    </HeaderWrapper>
  );
};

Header.propTypes = {
  siteTitle: PropTypes.string,
};

Header.defaultProps = {
  siteTitle: ``,
};

export default Header;
