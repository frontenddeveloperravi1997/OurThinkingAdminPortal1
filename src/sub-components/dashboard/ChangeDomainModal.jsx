import React, { useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import { Col, Row, Form } from "react-bootstrap";
import Select from "react-select";
import { Button, Spinner } from "react-bootstrap"; // Import Spinner
import { getRolesData, updateUserRole } from '@/app/api/user';
import { toast } from "react-toastify";

const ChangeDomainModal = ({ show, onClose, checkedUsers }) => {
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [updatedRoleList, setUpdatedRoleList] = useState([]);
  const [loading, setLoading] = useState(false); // Add loading state

  const fetchRolesData = async () => {
    try {
      const rolesData = await getRolesData();
      if (rolesData?.statusCode === 200) {
        const formattedRoles = rolesData?.data?.data.map((item) => ({
          value: item?.roleID,
          label: item?.roleName,
        }));
        setUpdatedRoleList(formattedRoles);
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
    } catch (error) {
      toast.error("Failed to fetch roles!", {
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

  useEffect(() => {
    fetchRolesData();
  }, []);

  const handleRoleSelect = (selectedOption) => {
    setSelectedRoles(selectedOption);
  };

  const submitRoles = async () => {
    setLoading(true); // Start loading
    try {
      const roleIds = selectedRoles.map((item) => item.value);
      if(roleIds.length < 1){
        toast.error("You must select at least one role", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        return false;
      }
      const userIds = Object.keys(checkedUsers);
      const payload = { roleIds, userIds };
      await updateUserRole(payload);
      toast.success("Successfully added user roles!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      onClose(); // Close the modal after the operation
    } catch (error) {
      toast.error("Failed to update roles!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } finally {
      setLoading(false); // End loading
    }
  };
  

  const handleHideActionPop = () => {
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose}  centered  size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Change user roles</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <Row className="mb-3">
            <Form.Label className="col-md-3" htmlFor="language">
              User roles
            </Form.Label>
            <Col md={8} xs={12}>
              <Select
                options={updatedRoleList}
                onChange={handleRoleSelect}
                placeholder="Select roles"
                isClearable
                isMulti
                value={selectedRoles}
              />
            </Col>
          </Row>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={submitRoles} disabled={loading}>
          {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : "Add"}
        </Button>
        <Button variant="secondary" onClick={handleHideActionPop} disabled={loading}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChangeDomainModal;
