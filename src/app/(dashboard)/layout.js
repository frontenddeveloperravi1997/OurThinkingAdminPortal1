'use client'
// import node module libraries
import { useState,useEffect } from 'react';

// import theme style scss file
import '../../styles/theme.scss';

// import sub components
import NavbarVertical from '../../layouts/navbars/NavbarVertical';
import NavbarTop from '../../layouts/navbars/NavbarTop';
import { useIsAuthenticated,useMsal } from "@azure/msal-react";
import { useRouter } from 'next/navigation';
export default function DashboardLayout({ children }) {
	const router = useRouter();
	const isAuthenticated = useIsAuthenticated();
	const { instance, accounts, inProgress } = useMsal();
	const [showMenu, setShowMenu] = useState(true);
	const [isLoading,setIsLoading] = useState(true);
	const [progressStatus, setProgressStatus] = useState("startup")
	const ToggleMenu = () => {
		return setShowMenu(!showMenu);
	};
	/*useEffect(()=>{
		 console.log("isAuthenticated",isAuthenticated,inProgress)
		if(isAuthenticated===false && inProgress==="none"){
			setIsLoading(false);
			console.log("isAuthenticated",isAuthenticated)
		    router.replace("/")
		}else{
			setIsLoading(false)
		}
	   },[isAuthenticated,inProgress]);*/

	

	return (
		<>
		{inProgress === "startup"?<></>:(	<div id="db-wrapper" className={`${showMenu ? '' : 'toggled'}`}>
			<div  className="navbar-vertical navbar">
				<NavbarVertical
					showMenu={showMenu}
					onClick={(value) => setShowMenu(value)}
				/>
			</div>
			<div id="page-content">
				<div className="header">
					<NavbarTop
						data={{
							showMenu: showMenu,
							SidebarToggleMenu: ToggleMenu
						}}
					/>
				</div>
				{children}
			</div>
		</div>)}
	
		</>
	)
}
