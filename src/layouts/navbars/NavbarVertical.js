import { Fragment, useContext, useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { usePathname, useRouter } from 'next/navigation';
import { useMediaQuery } from 'react-responsive';
import { Badge } from 'react-bootstrap';
import AccordionContext from 'react-bootstrap/AccordionContext';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import DashboardMenu from '@/routes/DashboardRoutes';

const NavbarVertical = (props) => {
    const location = usePathname();
    const router = useRouter();

    const isMobile = useMediaQuery({ maxWidth: 767 });

    const [openMenu, setOpenMenu] = useState(null);

    const handleMenuClick = (id) => {
        if (openMenu === id) {
            setOpenMenu(null);
        } else {
            setOpenMenu(id);
        }
    };

    return (
        <Fragment>
            {DashboardMenu.map((item, index) => {
                const itemName = item.name || ''; 
                const isSelected = location === item.link;
                const hasSubMenu = item.subMenu && item.subMenu.length > 0;
                const isSubMenuOpen = openMenu === item.id;

                const shouldShowSubMenu = index === 1 && isSubMenuOpen;

                const isOrganizationItem = itemName.toLowerCase() === 'organization';
                const linkClassName = `nav__links ${isSelected ? "nav__selected" : ""} ${index === 1 && !isSubMenuOpen && isOrganizationItem ? "organization" : ""}`;

                return (
                    <Fragment key={item.id}>
                        <Link
                            className={linkClassName}
                            href={item.link}                            
                        >
                            <p>{item.icon}</p>
                            <p>{item.title}</p>
                            {/* <p>{item.link}</p> */}
                            {hasSubMenu && (
                                <span className="dropdown-arrow"
								onClick={(e) => {
									handleMenuClick(item.id);
									if (hasSubMenu) {
										e.preventDefault(); 
										e.stopPropagation();
									} else {
										if (isMobile) {
											props.onClick(!props.showMenu);
										}
									}
								}}
								>
                                    {shouldShowSubMenu ? <FaChevronDown /> : <FaChevronRight />}
                                </span>
                            )}
                        </Link>
                        {hasSubMenu && shouldShowSubMenu && (
                            <div className="submenu">
                                {item.subMenu.map((subItem) => (
                                    <Link
                                        className={`nav__links ${subItem.link.includes(location) ? "nav__selected" : ""}`}
                                        href={subItem.link}
                                        key={subItem.id}
                                    >
                                        <p>{subItem.icon}</p>
                                        <p>{subItem.title}</p>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </Fragment>
                );
            })}
        </Fragment>

    );
};

export default NavbarVertical;
