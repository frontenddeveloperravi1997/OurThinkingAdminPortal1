// import node module libraries
import Link from 'next/link';
import { Fragment, useState,useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import {
    Row,
    Col,
    Image,
    Dropdown,
    ListGroup,
    Button
} from 'react-bootstrap';

import 'simplebar/dist/simplebar.min.css';
import { useMsal, AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import {User} from 'react-feather'
import Spinner from "react-bootstrap/Spinner";
import { toast, ToastContainer } from "react-toastify";
// import hooks
import useMounted from '../hooks/useMounted';
import CommonModal from '@/sub-components/dashboard/CommonModal';
import { useRouter } from "next/navigation";
const QuickMenu = () => {
    const router = useRouter();
    const { instance, accounts } = useMsal();
    const [isLoading,setIsLoading] = useState(false);
    const [showCancelPop, setShowCancelPop] = useState(false);
    const [userDetails,setUserDetails] = useState({
        name:"",
        role:"",
        userName:""
    })
    const hasMounted = useMounted();
    
    const isDesktop = useMediaQuery({
        query: '(min-width: 1224px)'
    })

    const handleLogOut = async () =>{
        setIsLoading(true)
          try {
              const logoutResponse = await instance.logoutRedirect();
              setIsLoading(false)
              router.replace("/")
          } catch (error) {
              setIsLoading(false);
              toast.error("Oops something went wrong!", {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "colored",
                });
          }
        
      };

      const handleShowCancelPop = () => {
        setShowCancelPop(true);
      };
      const handleHideCancelPop = () => {
        setShowCancelPop(false);
      };


      useEffect(()=>{
        if(accounts){
            setUserDetails({
                name:accounts?.[0]?.name,
                userName:accounts?.[0]?.username,
                role:""
            })
        }
    
    },[accounts])

    const QuickMenuDesktop = () => {
        return (
        <ListGroup as="ul" bsPrefix='navbar-nav' className="navbar-right-wrap ms-auto d-flex nav-top-wrap">
            <Dropdown as="li" className="ms-2">
                <Dropdown.Toggle
                    as="a"
                    bsPrefix=' '
                    className="rounded-circle"
                    id="dropdownUser">
                <div className="d-flex justify-content-center align-items-center  rounded-circle" style={{ width: '40px', height: '40px', background:"#624BFF" }}>
  <User size="25px" className="text-muted" color='#fff' />
</div>
                </Dropdown.Toggle>
                <Dropdown.Menu
                    className="dropdown-menu dropdown-menu-end "
                    align="end"
                    aria-labelledby="dropdownUser"
                    show
                    >
                    <Dropdown.Item as="div" className="px-4 pb-0 pt-2" bsPrefix=' '>
                            <div className="lh-1 ">
                                <h5 className="mb-1">{userDetails?.name}</h5>
                            </div>
                            <div className=" dropdown-divider mt-3 mb-2"></div>
                    </Dropdown.Item>
                    <Dropdown.Item onClick={handleShowCancelPop}>
                        <i className="fe fe-power me-2"></i>Sign Out
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </ListGroup>
    )}

    const QuickMenuMobile = () => {
        return (
        <ListGroup as="ul" bsPrefix='navbar-nav' className="navbar-right-wrap ms-auto d-flex nav-top-wrap">
            <Dropdown as="li" className="ms-2">
                <Dropdown.Toggle
                    as="a"
                    bsPrefix=' '
                    className="rounded-circle"
                    id="dropdownUser">
                                 <div className="d-flex justify-content-center align-items-center  rounded-circle" style={{ width: '40px', height: '40px', background:"#624BFF" }}>
  <User size="25px" className="text-muted" color='#fff' />
</div>
                </Dropdown.Toggle>
                <Dropdown.Menu
                    className="dropdown-menu dropdown-menu-end "
                    align="end"
                    aria-labelledby="dropdownUser"
                    >
                    <Dropdown.Item as="div" className="px-4 pb-0 pt-2" bsPrefix=' '>
                            <div className="lh-1 ">
                                <h5 className="mb-1">{userDetails?.name}</h5>
                                
                            </div>
                            <div className=" dropdown-divider mt-3 mb-2"></div>
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="2">
                        <i className="fe fe-user me-2"></i> Edit Profile
                    </Dropdown.Item>
                    <Dropdown.Item onClick={handleShowCancelPop}>
                        <i className="fe fe-power me-2"></i>Sign Out
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </ListGroup>
    )}

    return (
        <Fragment>
                <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <CommonModal
        show={showCancelPop}
        onClose={handleHideCancelPop}
        heading={"Sign out?"}
        body={`Are you sure you want to Sign out`}
      >
      <>
          <Button variant="secondary" onClick={handleHideCancelPop}>
            No
          </Button>
          <Button
            onClick={handleLogOut}
            className="btn btn-danger"
            disabled={isLoading}
          >
          Yes
          {isLoading && (
              <Spinner
                style={{ marginLeft: "8px" }}
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            )}
          </Button>
       
        </>
      </CommonModal>
            { hasMounted && isDesktop ? <QuickMenuDesktop /> : <QuickMenuMobile />}
        </Fragment>
    )
}

export default QuickMenu;