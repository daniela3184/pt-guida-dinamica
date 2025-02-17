import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { CSSTransition } from "react-transition-group";
import { Link } from "gatsby";
import { Dropdown, DropdownToggle, DropdownMenu } from "reactstrap";

import Icon from "./icon";

class MegaMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOffcanvasOpen: false,
      isDropdownOpen: {}
    };
  }

  toggleOffcanvas() {
    this.setState(prevState => {
      return {
        isOffcanvasOpen: !prevState.isOffcanvasOpen
      };
    });
  }

  toggleDropdown(menuItem) {
    this.setState(prevState => {
      let isDropdownOpen = { ...prevState.isDropdownOpen };

      isDropdownOpen[menuItem] = !prevState.isDropdownOpen[menuItem];
      return {
        isDropdownOpen: isDropdownOpen
      };
    });
  }

  renderMenu(parentSlug, menuTree, depth = 0) {
    return (
      <ul className={`depth-${depth} p-${depth > 0 ? "0" : "2"} megamenu-list`}>
        {menuTree.map(subMenuItem => (
          <li
            className={`mx-${depth > 0 ? "2" : "4"} my-2`}
            key={`${parentSlug}-${subMenuItem.slug}`}
          >
            {subMenuItem.slug && (
              <Link
                className="w-100 d-inline-block"
                to={`/${parentSlug}/${subMenuItem.slug}`}
              >
                {subMenuItem.name}{" "}
                <span className="sr-only">{subMenuItem.subtitle}</span>
              </Link>
            )}
            {subMenuItem.href && (
              <a className="w-100 d-inline-block" href={subMenuItem.href}>
                {subMenuItem.name}{" "}
                <span className="sr-only">{subMenuItem.subtitle}</span>
              </a>
            )}
            {subMenuItem.subtree &&
              this.renderMenu(
                `/${parentSlug}/${subMenuItem.slug}`,
                subMenuItem.subtree,
                depth + 1
              )}
          </li>
        ))}
      </ul>
    );
  }

  render() {
    return (
      <nav
        className="navbar navbar-expand-lg has-megamenu"
        aria-label="main navigation"
      >
        <button
          className="custom-navbar-toggler"
          type="button"
          aria-controls="megaMenu"
          aria-expanded={this.state.isOffcanvasOpen}
          aria-label="Toggle navigation"
          onClick={() => this.toggleOffcanvas()}
        >
          <Icon icon="list" />
        </button>
        <CSSTransition
          in={this.state.isOffcanvasOpen}
          timeout={{
            enter: 1,
            exit: 300
          }}
          classNames={{
            enter: "navbar-collapsable d-block",
            enterDone: "navbar-collapsable d-block expanded",
            exit: "navbar-collapsable d-block",
            exitDone: "navbar-collapsable"
          }}
        >
          {state => (
            <div className="navbar-collapsable" id="megaMenu">
              <div
                className="overlay d-block"
                onClick={() => this.toggleOffcanvas()}
              />
              <div className="close-div sr-only">
                <button
                  className="btn close-menu"
                  type="button"
                  onClick={() => this.toggleOffcanvas()}
                >
                  <Icon icon="close" />
                  close
                </button>
              </div>
              <div className="menu-wrapper">
                <ul className="navbar-nav">
                  {this.props.menu.map(menuItem => (
                    <li
                      key={menuItem.slug}
                      className={classNames({
                        "mb-3": this.state.isOffcanvasOpen
                      })}
                    >
                      {menuItem.subtree ? (
                        <Dropdown
                          isOpen={
                            this.state.isOffcanvasOpen ||
                            this.state.isDropdownOpen[menuItem.slug]
                          }
                          toggle={() => this.toggleDropdown(menuItem.slug)}
                          className="nav-item megamenu"
                        >
                          <DropdownToggle
                            tag="a"
                            className="nav-link dropdown-toggle"
                            style={{
                              marginBottom:
                                this.state.isOffcanvasOpen && "-16px",
                              cursor: "pointer"
                            }}
                          >
                            {menuItem.name}
                            <Icon
                              icon="expand"
                              className={classNames("icon-xs", "ml-1", {
                                "d-none": this.state.isOffcanvasOpen
                              })}
                            />
                          </DropdownToggle>
                          <DropdownMenu
                            modifiers={{
                              relativePosition: {
                                enabled: true,
                                order: 890,
                                fn: data => {
                                  data = this.state.isOffcanvasOpen
                                    ? /* eslint-disable indent */
                                      {
                                        ...data,
                                        styles: {
                                          ...data.styles,
                                          borderRadius: "4px",
                                          position: "relative",
                                          transform: "none",
                                          animationDuration: "0.1s"
                                        }
                                      }
                                    : {
                                        ...data,
                                        styles: {
                                          ...data.styles,
                                          borderRadius: "4px",
                                          transform:
                                            "translate3d(25px, 35px, 0px)",
                                          animationDuration: "0.1s"
                                        }
                                      };
                                  /* eslint-enable indent */
                                  return data;
                                }
                              }
                            }}
                            className="p-3"
                          >
                            {this.renderMenu(menuItem.slug, menuItem.subtree)}
                          </DropdownMenu>
                        </Dropdown>
                      ) : (
                        <Link
                          to={`/${menuItem.slug}`}
                          className="nav-link dropdown-toggle"
                        >
                          {menuItem.name}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </CSSTransition>
      </nav>
    );
  }
}

MegaMenu.propTypes = {
  menu: PropTypes.arrayOf(
    PropTypes.exact({
      name: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      subtitle: PropTypes.string,
      subtree: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          slug: PropTypes.string.isRequired,
          subtitle: PropTypes.string
        })
      )
    })
  )
};

export default MegaMenu;
