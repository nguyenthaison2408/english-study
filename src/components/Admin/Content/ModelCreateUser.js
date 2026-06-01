import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FaUser, FaEnvelope, FaLock, FaUserShield, FaImage } from 'react-icons/fa';
import './ModalCreateUser.scss';

const ModalCreateUser = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button className="btn-add-user" onClick={handleShow}>
        <span className="btn-icon">+</span>
        Add New User
      </Button>

      <Modal 
        show={show} 
        onHide={handleClose} 
        size='lg' 
        backdrop='static'
        centered
        className="modern-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FaUser className="modal-title-icon" />
            Add New User
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          <form className="modern-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <FaEnvelope className="label-icon" />
                  Email Address
                </label>
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="example@email.com"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FaLock className="label-icon" />
                  Password
                </label>
                <input 
                  type="password" 
                  className="form-control" 
                  placeholder="Enter password"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <FaUser className="label-icon" />
                  Username
                </label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Enter username"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FaUserShield className="label-icon" />
                  Role
                </label>
                <select className="form-select">
                  <option value='USER'>User</option>
                  <option value='ADMIN'>Admin</option>
                </select>
              </div>
            </div>

            <div className="form-group full-width">
              <label className="form-label">
                <FaImage className="label-icon" />
                Profile Image
              </label>
              <div className="file-input-wrapper">
                <input 
                  type='file' 
                  className="file-input"
                  accept="image/*"
                />
                <div className="file-input-placeholder">
                  <span className="upload-icon">📁</span>
                  <span>Click to upload or drag and drop</span>
                  <span className="file-hint">PNG, JPG or JPEG (max. 2MB)</span>
                </div>
              </div>
            </div>
          </form>
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} className="btn-cancel">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleClose} className="btn-save">
            Save User
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalCreateUser;