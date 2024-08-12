import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card, Table, Dropdown, Form, Button } from "react-bootstrap";
import { MoreVertical } from "react-feather";
import { organizationList } from "@/app/api/organization";
import { formatDate } from "@/utils/formateDate";
import { toast, ToastContainer } from "react-toastify";
import Spinner from "react-bootstrap/Spinner";
import { commonQuery, exportAllOrgReport } from "@/app/api/user";
import { useQuery, useMutation } from "@tanstack/react-query";
import CommonModal from "./CommonModal";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "react-responsive";
import ChangeGroupModal from "./ChangeGroupModal";
const Organizations = ({
  pageNumber,
  setTotalPages,
  itemsDisplayed,
  totalCount,
  orgCategoryList,
}) => {
  const isMobile = useMediaQuery({
    query: "(max-width: 768px)",
  });
  const buttonWrap = isMobile
    ? "d-flex gap-3 flex-column w-100 flex-wrap"
    : "d-flex gap-3 flex-wrap";
  const UploadWrap = isMobile ? "d-flex flex-column w-100 " : "";
  const router = useRouter();
  const [organizationdata, setOrganizations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;
  const [isLoading, setLoading] = useState(false);
  const [showActionPop, setShowActionPop] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [checkedUsers, setCheckedUsers] = useState({});
  const [showDomainPopup, setDomainPop] = useState(false);
  const [currentActionDetails, setCurrentActionDetails] = useState({
    orgId: "",
    status: "",
    name: "",
  });
  const handleDisableEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };
  const handleChangeMultipleDomain = () => {
    setDomainPop(true);
  };
  const closeChangeDomainPop = () => {
    setDomainPop(false);
  };
  const handleCheckboxChange = (userID, status) => {
    setCheckedUsers((prevCheckedUsers) => ({
      ...prevCheckedUsers,
      [userID]: {
        status,
        isChecked: !prevCheckedUsers[userID]?.isChecked,
      },
    }));
  };
  const isCheckedUsersNotEmpty = Object.keys(checkedUsers).some(
    (key) => checkedUsers[key].isChecked
  );

  const handleDownloadOrg = async () => {
    setExportLoading(true);
    try {
      const response = await exportAllOrgReport();

      toast.success("Organization file downloaded successfully!!", {
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

  //delete org

  const {
    isPending: isPendingDelete,

    mutate: deleteMultiple,
  } = useMutation({
    mutationFn: async (data) => {
      return await commonQuery(
        "Delete",
        `/api/Organization/DeleteMultiOrganization`,
        data
      );
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
        fetchOrganizations();
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

  const fetchOrganizations = async () => {
    setLoading(true);
    try {
      const responseData = await organizationList(pageNumber);
      if (responseData?.statusCode === 200) {
        setOrganizations(responseData.data?.data);
        setCheckedUsers({});
        setTotalPages(responseData.data?.totalPages);
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
      console.error("Error fetching organizations:", error);
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
        `/api/Organization/StatusChange?status=${data?.status}`,
        data?.data
      );
    },
    onSuccess(data, variables, context) {
      if (data?.data?.statusCode === 200) {
        toast.success("Organization status updated successfully!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });

        fetchOrganizations();
        setShowActionPop(false);
        setCurrentActionDetails({
          orgId: "",
          status: "",
          name: "",
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

  useEffect(() => {
    fetchOrganizations();
  }, [pageNumber]);

  useEffect(() => {
    const fetchOptions = async () => {
      if (searchQuery.trim() === "") {
        fetchOrganizations();
      }
      try {
        const response = await organizationList(null, searchQuery);

        if (response?.statusCode === 200) {
          setOrganizations(response.data?.data);

          // setLoading(false)
        } else if (response?.statusCode === 204) {
          toast.warning("No organization found!", {
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

        // setOptions(response.data); // Assuming the API returns an array of options
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
        // Handle error appropriately
      }
    };

    // Debounce the API call to avoid making a call for every keystroke
    const delayDebounce = setTimeout(() => {
      fetchOptions();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleShowActionPop = (status, id, name) => {
    setShowActionPop(true);
    setCurrentActionDetails({
      orgId: id,
      status,
      name,
    });
  };
  const handleHideActionPop = () => {
    setShowActionPop(false);
  };

  const handleUpdateStatus = (status, id) => {
    updateStatus({
      data: [id],
      status,
    });
  };

  const handleMultipleDelete = () => {
    const getCheckedUsers = Object.keys(checkedUsers)
      .filter((key) => checkedUsers[key].isChecked)
      .map((key) => Number(key));
    deleteMultiple(getCheckedUsers);
  };

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
      className="text-muted text-primary-hover"
    >
      {children}
    </Link>
  ));
  CustomToggleMore.displayName = "CustomToggleMore";
  const ActionMenu = ({ organizationId, orgName, orgStatus }) => (
    <Dropdown>
      <Dropdown.Toggle as={CustomToggle}>
        <MoreVertical size="15px" className="text-muted" />
      </Dropdown.Toggle>
      <Dropdown.Menu align={"end"}>
        <Dropdown.Item
          eventKey="1"
          as={Link}
          href={`/organization/update/${organizationId}`}
          passHref
        >
          Edit Organization
        </Dropdown.Item>
        {/* {orgStatus !=="active" &&(<Dropdown.Item onClick={()=> handleShowActionPop("active",organizationId,orgName)} eventKey="2">Activate</Dropdown.Item>)}
                {orgStatus !=="disable" &&(<Dropdown.Item onClick={()=> handleShowActionPop("disable",organizationId,orgName)} eventKey="3">Disable</Dropdown.Item>)}
                
                
                {orgStatus !=="archive" &&(<Dropdown.Item onClick={()=> handleShowActionPop("archive",organizationId,orgName)} eventKey="4">Archive</Dropdown.Item>)} */}
      </Dropdown.Menu>
    </Dropdown>
  );
  const ActionMoreMenu = ({ userID, status, userEmail, emailVerify }) => (
    <Button onClick={() => {}} className="more-btn" variant="outline-dark">
      <Dropdown>
        <Dropdown.Toggle as={CustomToggleMore}>More +</Dropdown.Toggle>
        <Dropdown.Menu align={"end"}>
          <Dropdown.Item onClick={handleChangeMultipleDomain} eventKey="1">
            Add to group
          </Dropdown.Item>

          <Dropdown.Item onClick={handleMultipleDelete} eventKey="2">
            Delete
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Button>
  );

  return (
    <>
      <ChangeGroupModal
        show={showDomainPopup}
        onClose={closeChangeDomainPop}
        checkedUsers={checkedUsers}
        orgCategoryList={orgCategoryList}
        setCheckedUsers={setCheckedUsers}
      />
      <CommonModal
        show={showActionPop}
        onClose={handleHideActionPop}
        heading={`Status Update`}
        body={`
          Do you want to update status of ${currentActionDetails?.name} to ${currentActionDetails?.status}
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
                currentActionDetails?.orgId
              )
            }
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
                onClick={() => router.push("/organization/create")}
                variant="outline-dark"
              >
                Create New Organization
              </Button>

              <Button
                onClick={handleDownloadOrg}
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
              {isCheckedUsersNotEmpty && (
                <div className={UploadWrap}>
                  {/* <Button onClick={()=>{}}     variant="outline-dark">
    More +

  </Button> */}
                  <ActionMoreMenu />
                </div>
              )}
              <div className="d-flex gap-1 flex-row align-items-center">
                <p className="m-0">Organization:</p>
                <p className="m-0">{`${itemsDisplayed} of ${totalCount}`}</p>
              </div>
            </div>

            <div className={`ms-lg-3 ${isMobile && "w-100"}`}>
              <Form className="d-flex align-items-center">
                <Form.Control
                  type="search"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleDisableEnter}
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
                {/* <th>Sr/No.</th> */}
                {/* <th>ID</th> */}
                <th>Organization Name</th>
                <th>Users</th>
                {/* <th>Status</th> */}
                <th>Created Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {organizationdata &&
                organizationdata?.map((organization, index) => (
                  <tr key={organization?.organizationId}>
                    <td className="align-middle">
                      <Form.Check
                        type="checkbox"
                        checked={
                          !!checkedUsers[organization?.organizationId]
                            ?.isChecked
                        }
                        onChange={() =>
                          handleCheckboxChange(
                            organization?.organizationId,
                            organization?.status
                          )
                        }
                      />
                      {/* {index + 1 + (pageNumber - 1) * 10} */}
                    </td>
                    {/* <td className="align-middle">
                    {index + 1 + (pageNumber - 1) * itemsPerPage}
                  </td> */}
                    {/* <td className="align-middle">
                    {organization?.organizationId}
                  </td> */}
                    <td className="align-middle">
                      <div className="d-flex align-items-center">
                        <div className="lh-1">
                          <h5 className="mb-1">
                            {organization?.organizationName}
                          </h5>
                        </div>
                      </div>
                    </td>
                    <td className="align-middle">{organization?.userCount}</td>
                    {/* <td className="align-middle">{organization?.status}</td> */}
                    <td className="align-middle">
                      {formatDate(organization?.createdDate)}
                    </td>
                    <td className="align-middle">
                      <ActionMenu
                        organizationId={organization?.organizationId}
                        orgName={organization?.organizationName}
                        orgStatus={organization?.status}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        )}
      </Card>
    </>
  );
};

export default Organizations;
