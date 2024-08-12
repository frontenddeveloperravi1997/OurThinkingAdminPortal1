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

	const CustomToggle = ({ children, eventKey, icon }) => {
		const isUsersClickedRef = useRef(false);
		const { activeEventKey } = useContext(AccordionContext);
		const decoratedOnClick = useAccordionButton(eventKey, () =>
			console.log('totally custom!', eventKey)
		);

		const decoratedDefault = useAccordionButton(0, () =>
			console.log('totally custom!', eventKey)
		);

		const isCurrentEventKey = activeEventKey === eventKey;

		useEffect(() => {
			if (location === "/" && isUsersClickedRef.current === false) {
				console.log("eventKey", eventKey, location, isUsersClickedRef.current);
				decoratedDefault();
				isUsersClickedRef.current = true;
			}
		}, [location, isUsersClickedRef.current]);

		return (
			<li className="nav-item">
				<Link
					href="#"
					className="nav-link"
					onClick={decoratedOnClick}
					data-bs-toggle="collapse"
					data-bs-target="#navDashboard"
					aria-expanded={isCurrentEventKey ? true : false}
					aria-controls="navDashboard"
				>
					{icon ? <i className={`nav-icon fa fa-${icon} me-2`}></i> : ''}{' '}
					{children}
				</Link>
			</li>
		);
	};

	const CustomToggleLevel2 = ({ children, eventKey, icon }) => {
		const { activeEventKey } = useContext(AccordionContext);
		const decoratedOnClick = useAccordionButton(eventKey, () =>
			console.log('totally custom!')
		);
		const isCurrentEventKey = activeEventKey === eventKey;
		console.log("isCurrentEventKey", isCurrentEventKey);
		return (
			<Link
				href="#"
				className="nav-link"
				onClick={decoratedOnClick}
				data-bs-toggle="collapse"
				data-bs-target="#navDashboard"
				aria-expanded={isCurrentEventKey ? true : false}
				aria-controls="navDashboard"
			>
				{children}
			</Link>
		);
	};

	const generateLink = (item) => {
		const itemName = item.name || ''; // Default to an empty string if item.name is undefined
		const linkClassName = `nav-link ${location === item.link ? 'active' : ''} ${itemName.toLowerCase() === 'organization' ? 'organization' : ''}`;
		return (
			<Link
				href={item.link}
				className={linkClassName}
				onClick={(e) => {
					if (isMobile) {
						props.onClick(!props.showMenu);
					}
				}}
			>
				{itemName}
				{''}
				{item.badge ? (
					<Badge
						className="ms-1"
						bg={item.badgecolor ? item.badgecolor : 'primary'}
					>
						{item.badge}
					</Badge>
				) : (
					''
				)}
			</Link>
		);
	};
	

	const isMobile = useMediaQuery({ maxWidth: 767 });

	const [openMenu, setOpenMenu] = useState(null);

	const handleMenuClick = (id, link) => {
		if (openMenu === id) {
			setOpenMenu(null);
			router.push(link); // Use router.push to navigate without reloading
		} else {
			setOpenMenu(id);
		}
	};

	return (
		<Fragment>
  {DashboardMenu.map((item, index) => {
    const itemName = item.name || ''; // Default to an empty string if item.name is undefined
    const isSelected = location === item.link;
    const hasSubMenu = item.subMenu && item.subMenu.length > 0;
    const isSubMenuOpen = openMenu === item.id;
    
    // Determine if the submenu should be open based on index
    const shouldShowSubMenu = index === 1 && isSubMenuOpen;

    const isOrganizationItem = itemName.toLowerCase() === 'organization';
    const linkClassName = `nav__links ${isSelected ? "nav__selected" : ""} ${index === 1 && !isSubMenuOpen && isOrganizationItem ? "organization" : ""}`;

    return (
      <Fragment key={item.id}>
        <Link
          className={linkClassName}
          href={item.link}
          onClick={(e) => {
            if (hasSubMenu) {
              e.preventDefault();
              handleMenuClick(item.id, item.link);
            } else {
              if (isMobile) {
                props.onClick(!props.showMenu);
              }
            }
          }}
        >
          <p>{item.icon}</p>
          <p>{item.title}</p>
          {hasSubMenu && (
            <span className="dropdown-arrow">
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
