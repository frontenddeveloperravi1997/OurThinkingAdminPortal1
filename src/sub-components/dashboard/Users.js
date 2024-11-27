
import React, { useEffect, useState,useRef } from "react";
import Link from "next/link";
import { Card, Table, Dropdown, Form, Button } from "react-bootstrap";
import { MoreVertical } from "react-feather";
import { getUsersList } from "@/app/api/user";
import { toast, ToastContainer } from "react-toastify";
import Spinner from "react-bootstrap/Spinner";
import { useQuery, useMutation } from "@tanstack/react-query";
import { commonQuery, exportAllUsers,uploadBulkSheet,bulkTagging } from "@/app/api/user";
import CommonModal from "./CommonModal";
import { useRouter } from "next/navigation";
import { useMediaQuery } from 'react-responsive';
import ChangeDomainModal from "./ChangeDomainModal";
import ChangeBulkTaggingModal from "./ChangeBulkTaggingModal";
import ChangeMultipleOrganizationModal from "./ChangeMultipleOrganizationModal";
const Users = () => {
  const isMobile = useMediaQuery({
    query: '(max-width: 768px)'
});

const buttonWrap = isMobile?"d-flex gap-3 flex-column w-100 flex-wrap":"d-flex gap-3 flex-wrap"
const UploadWrap = isMobile?"d-flex flex-column w-100 ":""
  const router =useRouter()  
  const inputReference = useRef(null)
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [showActionPop, setShowActionPop] = useState(false);
  const [showDomainPopup,setDomainPop] = useState(false);
  const [showBulkTaggingPopup,setBulkTaggingPop] = useState(false);
  const [showMultipleOrganizationPopup,setMultipleOrganizationPop] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [currentActionDetails, setCurrentActionDetails] = useState({
    userId: "",
    status: "",
    email: "",
  });
  const [checkedUsers, setCheckedUsers] = useState({});
  const [file, setFile] = useState(null);
  const [fileUploadLoading,setFileUploadLoading] = useState(false);
  const [pageSize,setPageSize] = useState(0)
  const [pageNumber, setPageNumber] = useState(1);
  const itemsDisplayed = Math.min(pageNumber * pageSize, totalCount);
  const [hasFetched, setHasFetched] = useState(false);
  // const handleCheckboxChange = (userID, userEmail,emailVerify,status) => {
  //   setCheckedUsers((prevCheckedUsers) => ({
  //     ...prevCheckedUsers,
  //     [userID]: {
  //       userEmail,
  //       emailVerify,
  //       status,
  //       isChecked: !prevCheckedUsers[userID]?.isChecked,
  //     },
  //   }));
  // };

  const handleCheckboxChange = (userID, userEmail, emailVerify, status) => {
    setCheckedUsers((prevCheckedUsers) => {
        const isChecked = prevCheckedUsers[userID]?.isChecked;

        if (isChecked) {
            // Uncheck the user (remove from the checkedUsers)
            const { [userID]: _, ...rest } = prevCheckedUsers; // Remove userID from the state
            return rest;
        } else {
            // Check the user (add/update in the checkedUsers)
            return {
                ...prevCheckedUsers,
                [userID]: {
                    userEmail,
                    emailVerify,
                    status,
                    isChecked: true,
                },
            };
        }
    });
};
  const isCheckedUsersNotEmpty = Object.keys(checkedUsers).some(
    (key) => checkedUsers[key].isChecked
  );
  //console.log("checkedUser",checkedUsers)
  const handleDisableEnter = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

const handleChangeMultipleDomain = () =>{
  setDomainPop(true)
}

const closeChangeDomainPop = () =>{
  setDomainPop(false)
}

const handleChangeBulkTagging = () =>{
  setBulkTaggingPop(true)
}

const closeChangeBulkTagging = () =>{
  setBulkTaggingPop(false)
}

const handleChangeMultipleOrganization = () => {
  setMultipleOrganizationPop(true);
};

const handleKeyDown = (e) => {
  if (e.key === "Enter") {
    e.preventDefault();  
    fetchOptions();
  }
};


  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      setFileUploadLoading(true);
      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        const response = await uploadBulkSheet(formData);
      if(response?.statusCode === 200){
        setFileUploadLoading(false);
        toast.success("File uploaded successfully!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        inputReference.current.value = null;
      }else{
        setFileUploadLoading(false);
        inputReference.current.value = null;
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
    
      } catch (error) {
        inputReference.current.value = null;
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
        setFileUploadLoading(false);
      }
    }
  };
  const fileUploadClick  =() =>{
    inputReference?.current?.click()
  }

  const handleDownloadUserFile = async () => {
    setExportLoading(true);
    try {
      const response = await exportAllUsers();
     
      toast.success("Users file downloaded", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setExportLoading(false);
    } catch (error) {
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
      setExportLoading(false);
    }
  };
  const {
    isPending,
    isError,
    error,
    mutate: updateStatus,
    data,
  } = useMutation({
    mutationFn: async (data) => {
      return await commonQuery(
        "PUT",
        `/api/User/StatusChange?status=${data?.status}`,
        data?.data
      );
    },
    onSuccess(data, variables, context) {
    
      if (data?.data?.statusCode === 200) {
        toast.success("User status updated successfully!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });

        fetchUsers();
        setShowActionPop(false);
        setCurrentActionDetails({
          userId: "",
          status: "",
          email: "",
        });
      } else {
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
      // fetchUsers()
    },
    onError(error, variables, context) {
      console.error(error);
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
    },
  });
  const {
    isPending: isPendingInvite,

    mutate: inviteUser,
  } = useMutation({
    mutationFn: async (data) => {
      return await commonQuery("POST", `/api/User/InviteUser`, data);
    },
    onSuccess(data, variables, context) {  
      if (data?.data?.statusCode === 200) {
        toast.success("Invite Sent successfully", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else {
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
      // fetchUsers()
    },
    onError(error, variables, context) {
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
    },
  });

  // reset password mutation

  const {
    isPending: isPendingReset,
    mutate: resetPassword,
  } = useMutation({
    mutationFn: async (data) => {
      return await commonQuery("POST", `/api/User/resetPassword`, data);
    },
    onSuccess(data, variables, context) { 
      if (data?.data?.statusCode === 200) {
        toast.success("Sent successfully", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else {
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
      // fetchUsers()
    },
    onError(error, variables, context) {
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
    },
  });

  // delete multiple users
  const {
    isPending: isPendingDelete,
    mutate: deleteMultiple,
  } = useMutation({
    mutationFn: async (data) => {
      return await commonQuery("Delete", `/api/User/DeleteMultiUser`, data);
    },
    onSuccess(data, variables, context) { 
      if (data?.data?.statusCode === 200) {
        toast.success("Successfully Deleted", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        fetchUsers();
      } else {
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
      // fetchUsers()
    },
    onError(error, variables, context) {
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
    },
  });

  const handleUpdateStatus = (status, id) => {
    updateStatus({
      data: [id],
      status,
    });
  };
  const handleInvite = (email) => {
    inviteUser([email]);
  };

  const handleMultipleReset = () =>{
    const getCheckedUserEmails = Object.keys(checkedUsers)
    .filter((key) => checkedUsers[key].isChecked)
    .map((key) => checkedUsers[key].userEmail);
    resetPassword(getCheckedUserEmails);
  }
  // const handleMultipleSendInvite = () =>{
  //   const verifiedAndCheckedEmails = Object.keys(checkedUsers)
  //   .filter(key => checkedUsers[key].isChecked && checkedUsers[key].emailVerify === "Verified")
  //   .map(key => checkedUsers[key].userEmail);
  //   inviteUser(verifiedAndCheckedEmails);
  // }

  const handleMultipleSendInvite = () => {
    const verifiedAndCheckedEmails = Object.keys(checkedUsers)
    .filter(key => checkedUsers[key].isChecked && (checkedUsers[key].emailVerify !== "Verified"))
    .map(key => checkedUsers[key].userEmail);    
    inviteUser(verifiedAndCheckedEmails); 
  };

  const handleResetPassword = (email) => {
    resetPassword([email]);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const responseData = await getUsersList(pageNumber);
      if (responseData?.statusCode === 200) {
        setTotalPages(responseData?.data?.totalPages);
        setUsers(responseData?.data?.data);
        setPageSize(responseData?.data?.pageSize)
        setTotalCount(responseData?.data?.totalCount)
        setCheckedUsers({})
        setHasFetched(true);
        setLoading(false);
      } else {
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
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
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
      setLoading(false);
    }
  };

  // fetchOptions fetching users on the basis of searchQuery
  const fetchOptions = async () => 
  {
    if (searchQuery.trim() === "") {
      fetchUsers();
    }
    try {
      const response = await getUsersList(null, searchQuery);
      if (response?.statusCode === 200) {
        setUsers(response.data?.data);
        setTotalPages(response?.data?.totalPages);
        setTotalCount(response?.data?.totalCount)
        // setLoading(false)
      } else if(response?.statusCode === 204){
        const toastId = "no-user-found";
        setUsers([]);
        setTotalPages(1); 
        if (!toast.isActive(toastId)){
          toast.warning('No user found!!', {
            toastId,
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
      }      
      else {
        toast.error('Oops something went wrong!', {
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

  
      // setOptions(response.data); // Assuming the API returns an array of options
    } catch (error) {
      toast.error('Oops something went wrong!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
       
        });
      // Handle error appropriately
    }
  };
  
  useEffect(() => {
    if(!hasFetched){
      // console.log("pageNumber--->",pageNumber)
      fetchUsers();
    } 
  }, [pageNumber]);
  
  useEffect(() => {
    if (searchQuery.length > 2) {
      fetchOptions();
    }
  }, [searchQuery]);

  const handleShowActionPop = (status, id, email) => {
    setShowActionPop(true);
    setCurrentActionDetails({
      userId: id,
      status,
      email,
    });
  };
  const handleHideActionPop = () => {
    setShowActionPop(false);
  };

  const handleMultipleDelete = () =>{  
    const getCheckedUsers = Object.keys(checkedUsers)
    .filter(key => checkedUsers[key].isChecked)
    .map(key => Number(key));
    deleteMultiple(getCheckedUsers)
  }

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <Link
      href=""
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      className="text-muted text-primary-hover"
    >
      {children}
    </Link>
  ));

  CustomToggle.displayName = "CustomToggle";
  const CustomToggleMore = React.forwardRef(({ children, onClick }, ref) => (
    <Link
      href=""
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      className="text-muted text-primary-hover custom-link"
    >
      {children}
    </Link>
  ));
  CustomToggleMore.displayName = "CustomToggleMore";

  const ActionMenu = ({ userID, status, userEmail,emailVerify }) => (
    <Dropdown>
      <Dropdown.Toggle as={CustomToggle}>
        <MoreVertical size="15px" className="text-muted" />
      </Dropdown.Toggle>
      <Dropdown.Menu align={"end"}>
        <Dropdown.Item
          eventKey="1"
          as={Link}
          href={`/user/update/${userID}`}
          passHref
        >
          Edit Profile
        </Dropdown.Item>
      
        {/* <Dropdown.Item
          eventKey="2"
      disabled={Boolean(emailVerify === "Verified")}
          onClick={() => handleResetPassword(userEmail)}
        >
          {isPendingReset ? "Sending Invite.." : "Send Invitation"}
        </Dropdown.Item>
        <Dropdown.Item     onClick={() => handleResetPassword(userEmail)} eventKey="3">
        {isPendingReset ? "Sending..." : "Reset Password"}
          
          </Dropdown.Item>  */}
      </Dropdown.Menu>
    </Dropdown>
  );
  
  const ActionMoreMenu = ({ userID, status, userEmail,emailVerify }) => (
     
<Button onClick={() => {}} className="more-btn custom-more-cta" variant="outline-dark">
  <Dropdown>
    <Dropdown.Toggle as={CustomToggleMore}>
      {/* This will replace the content inside the button with CustomToggleMore */}
      More +
    </Dropdown.Toggle>
    <Dropdown.Menu align={"end"}>
      <Dropdown.Item
        eventKey="1"
        onClick={handleMultipleSendInvite}
      >
          {isPendingInvite ? "Sending Invite.." : "Send Invitation"}
      </Dropdown.Item>
      <Dropdown.Item onClick={handleMultipleReset} eventKey="2">
        {isPendingReset ? "Sending..." : "Reset Password"}
      </Dropdown.Item>
      <Dropdown.Item onClick={handleChangeMultipleOrganization} eventKey="3">
        Add to group
      </Dropdown.Item>
      <Dropdown.Item onClick={handleChangeMultipleDomain} eventKey="4">
        Change User Roles
      </Dropdown.Item>
      <Dropdown.Item onClick={handleMultipleDelete} eventKey="5">
        Delete
      </Dropdown.Item>
      <Dropdown.Item onClick={handleChangeBulkTagging} eventKey="6">
        User Bulk Tagging
      </Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown>
</Button>
  );

  return (
    <>
    {showDomainPopup && <ChangeDomainModal show={showDomainPopup} onClose={closeChangeDomainPop} checkedUsers={checkedUsers} />}
    {showBulkTaggingPopup && <ChangeBulkTaggingModal show={showBulkTaggingPopup} onClose={setBulkTaggingPop} checkedUsers={checkedUsers} />}
    {showMultipleOrganizationPopup && <ChangeMultipleOrganizationModal show={showMultipleOrganizationPopup} onClose={setMultipleOrganizationPop} checkedUsers={checkedUsers} />}
      <CommonModal
        show={showActionPop}
        onClose={handleHideActionPop}
        heading={`Status Update`}
        body={`
            Do you want to update status of ${currentActionDetails?.email} to ${currentActionDetails?.status}
            `}
      >
        <>
          <Button variant="secondary" onClick={handleHideActionPop}>
            No
          </Button>
          <Button
            onClick={() =>
              handleUpdateStatus(
                currentActionDetails?.status,
                currentActionDetails?.userId
              )
            }
            //  onClick={handleUpdateStatus(currentActionDetails?.status,currentActionDetails?.userId)}
            variant="primary" 
            disabled={isPending}
          >
              Yes
            {isPending && (
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
      <Card className="h-100">
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
          <Card.Header className="bg-white py-6">
          <div className="d-flex gap-3 justify-content-between align-items-center flex-wrap">
            <div className={buttonWrap}>
            <Button
              onClick={() => router.push("/user/create")}
           
          variant="outline-dark"
         
            >
                 Create New User
            </Button>
        
            <Button
              onClick={handleDownloadUserFile}
              disabled={exportLoading}
          variant="outline-dark"
         
            >
              Export
              {exportLoading && (
                <Spinner
                  style={{ marginLeft: "8px" }}
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              )}
            </Button>
            <div className={UploadWrap}>
              <Button onClick={fileUploadClick}     variant="outline-dark">
                Bulk Upload
              {fileUploadLoading && (
                <Spinner
                  style={{ marginLeft: "8px" }}
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              )}
              </Button>
              <input type="file" accept=".xlsx, .xls" hidden onChange={handleFileChange} ref={inputReference} />
            </div>
            {isCheckedUsersNotEmpty &&(
  <div className={UploadWrap}>
 
  <ActionMoreMenu  />

</div>
            )}
          
                    
                 
            <div>

            </div>
            <div className="d-flex gap-1 flex-row align-items-center" >
              <p className="m-0">Users:</p>
              <p  className="m-0">{`${itemsDisplayed} of ${totalCount}`}</p>
            </div>
            </div>
          
            <div className={`ms-lg-3 ${isMobile&&"w-100"}`}>
              <Form className="d-flex align-items-center">
                <Form.Control
                  type="search"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </Form>
            </div>
          </div>
        </Card.Header>
        {isLoading ? (
          <div
            style={{ height: "20vh" }}
            className="d-flex w-100 align-middle justify-content-center align-items-center "
          >
            <Spinner animation="border" role="status" variant="primary">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <Table responsive="xl" hover striped className="text-nowrap">
            <thead className="table-light">
              <tr>
                <th></th>
                {/* <th>User ID</th> */}
                <th>Name</th>
                <th>Email</th>
                <th>Organization</th>
                <th>Invite</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) =>{
           const invitationDate = user?.invitationDate;
           const formattedDate = invitationDate ? new Date(invitationDate).toLocaleDateString() : '';
                return (
                <tr key={user?.userID}>
                  <td className="align-middle">
                  <Form.Check
                    type="checkbox"
                    checked={!!checkedUsers[user?.userID]?.isChecked}
                  onChange={() =>
                    handleCheckboxChange(user?.userID, user?.email,user?.email_Verification,user?.status)
                  }
                  />
                    {/* {index + 1 + (pageNumber - 1) * 10} */}
                  </td>
                  {/* <td className="align-middle">{user?.userID}</td> */}
                  <td className="align-middle">
                    <div className="d-flex align-items-center">
                      <div className="lh-1">
                        <h5 className="mb-1">{user?.username}</h5>
                      </div>
                    </div>
                  </td>
                  <td className="align-middle">{user?.email}</td>
                  <td className="align-middle">
                    {user?.organization?.organizationName}
                  </td>
                  <td className="align-middle">
                    
                  {formattedDate}
                    
                   
                    
                  </td>
                  <td className="align-middle">
                    {user?.status ? user.status.charAt(0).toUpperCase() + user.status.slice(1) : ''}
                    </td>
                  <td className="align-middle">
                    <ActionMenu
                      userID={user?.userID}
                      status={user?.status}
                      userEmail={user?.email}
                      emailVerify={user?.email_Verification}
                    />
                  </td>
                </tr>
              )})}
            </tbody>
          </Table>
        )}
      </Card>
    </>
  );
};

export default Users;