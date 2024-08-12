import { v4 as uuid } from 'uuid';
import { Link } from 'react-feather';

export const DashboardMenu = [
	{
	  id: uuid(),
	  title: 'Users',
	  icon: <i className="nav-icon fa fa-user" aria-hidden="true" />,
	  link: '/user',
	},
	{
	  id: uuid(),
	  title: 'Organization',
	  icon: <i className="fa fa-users" aria-hidden="true" />,
	  link: '/organization',
	  className: 'organization', // Added className here
	  subMenu: [
		{
		  id: uuid(),
		  title: 'Organization Category',
		  icon: <i className="fa fa-users" aria-hidden="true" />,
		  link: '/organizationcategory',
		},
	  ],
	},
	{
	  id: uuid(),
	  title: 'White list domains',
	  icon: <i className="fa fa-link" aria-hidden="true" />,
	  link: '/whitelist',
	},
	{
	  id: uuid(),
	  title: 'Black list domains',
	  icon: <i className="fa fa-link" aria-hidden="true" />,
	  link: '/blacklist',
	},
	{
	  id: uuid(),
	  title: 'Exception list domains',
	  icon: <i className="fa fa-link" aria-hidden="true" />,
	  link: '/exceptionlist',
	},
	{
	  id: uuid(),
	  title: 'Reports',
	  icon: <i className="fa fa-list-alt" aria-hidden="true" />,
	  link: '/reports',
	},
];

export default DashboardMenu;
