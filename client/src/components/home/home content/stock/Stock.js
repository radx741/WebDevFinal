import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchItems } from '../../../../features/StockSlice';
import {
    Row,
    Col,
    Card,
    Table,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    Form,
    FormGroup,
    Label,
    Input,
} from 'reactstrap';
import { FaBox, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import './Stock.css';

export const Stock = () => {
    const dispatch = useDispatch();
    const stockItems = useSelector((state) => state.stock.stockItems);

    const [modalAdd, setModalAdd] = useState(false);
    const [modalEdit, setModalEdit] = useState(false);
    const [modalDelete, setModalDelete] = useState(false);

    const [currentItem, setCurrentItem] = useState(null);
    const [formData, setFormData] = useState({
        itemName: '',
        initial: '',
        sold: '',
        itemLocation: 'Storage 1',
    });

    useEffect(() => {
        dispatch(fetchItems());
    }, [dispatch]);

    const toggleAdd = () => {
        setModalAdd(!modalAdd);
        setFormData({ itemName: '', initial: '', sold: '', itemLocation: 'Storage 1' });
    };

    const toggleEdit = (item) => {
        if (item) {
            setCurrentItem(item);
            setFormData({
                itemName: item.itemName,
                initial: item.initial,
                sold: item.sold,
                itemLocation: item.itemLocation,
            });
        }
        setModalEdit(!modalEdit);
    };

    const toggleDelete = (item) => {
        if (item) setCurrentItem(item);
        setModalDelete(!modalDelete);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAddItem = async () => {
        try {
            const newItem = {
                itemName: formData.itemName,
                initial: parseInt(formData.initial) || 0,
                sold: parseInt(formData.sold) || 0,
                itemLocation: formData.itemLocation,
            };
            await axios.post('https://server-noo7.onrender.com/items', newItem);
            dispatch(fetchItems());
            toggleAdd();
        } catch (error) {
            console.error('Error adding item:', error);
        }
    };

    const handleEditItem = async () => {
        try {
            const updatedItem = {
                itemName: formData.itemName,
                initial: parseInt(formData.initial) || 0,
                sold: parseInt(formData.sold) || 0,
                itemLocation: formData.itemLocation,
            };
            await axios.put(`https://server-noo7.onrender.com/items/${currentItem._id}`, updatedItem);
            dispatch(fetchItems());
            toggleEdit(null);
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    const handleDeleteItem = async () => {
        try {
            await axios.delete(`https://server-noo7.onrender.com/items/${currentItem._id}`);
            dispatch(fetchItems());
            toggleDelete(null);
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    return (
        <div className="stock-container">
            <div className="stock-header">
                <h2>Stock Management</h2>
                <Button className="btn-new-item" onClick={toggleAdd}>
                    <FaPlus style={{ marginRight: '5px' }} /> New Item
                </Button>
            </div>

            <Card className="stock-overview-card">
                <div className="stock-overview-header">
                    <FaBox /> Stock Overview
                </div>
                <Table responsive hover className="stock-table mb-0">
                    <thead>
                        <tr>
                            <th>Item Name</th>
                            <th>Initial</th>
                            <th>Sold</th>
                            <th>Remaining</th>
                            <th>Status</th>
                            <th>Item Location</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stockItems.map((item) => (
                            <tr key={item._id}>
                                <td>{item.itemName}</td>
                                <td>{item.initial}</td>
                                <td>{item.sold}</td>
                                <td>{item.remaining}</td>
                                <td>
                                    <span
                                        className={`status-badge ${item.status === 'High' ? 'status-high' : 'status-low'
                                            }`}
                                    >
                                        {item.status}
                                    </span>
                                </td>
                                <td>{item.itemLocation}</td>
                                <td>
                                    <button
                                        className="action-btn"
                                        onClick={() => toggleEdit(item)}
                                        title="Edit"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        className="action-btn"
                                        onClick={() => toggleDelete(item)}
                                        title="Delete"
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>

            <Modal isOpen={modalAdd} toggle={toggleAdd} centered size="lg">
                <ModalHeader toggle={toggleAdd}>
                    <FaPlus style={{ marginRight: '10px' }} /> Add New Stock Item
                </ModalHeader>
                <ModalBody>
                    <Form>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="itemName" className="form-label">
                                        Item Name
                                    </Label>
                                    <Input
                                        type="text"
                                        name="itemName"
                                        id="itemName"
                                        value={formData.itemName}
                                        onChange={handleChange}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="itemLocation" className="form-label">
                                        Item Location
                                    </Label>
                                    <Input
                                        type="select"
                                        name="itemLocation"
                                        id="itemLocation"
                                        value={formData.itemLocation}
                                        onChange={handleChange}
                                    >
                                        <option>Storage 1</option>
                                        <option>Storage 2</option>
                                    </Input>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="initialStock" className="form-label">
                                        Initial
                                    </Label>
                                    <Input
                                        type="number"
                                        name="initial"
                                        id="initialStock"
                                        value={formData.initial}
                                        onChange={handleChange}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="soldStock" className="form-label">
                                        Sold
                                    </Label>
                                    <Input
                                        type="number"
                                        name="sold"
                                        id="soldStock"
                                        value={formData.sold}
                                        onChange={handleChange}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <div className="text-center mt-3">
                            <Button className="btn-modal-action" onClick={handleAddItem} style={{ width: 'auto', paddingLeft: '40px', paddingRight: '40px' }}>
                                Add Item
                            </Button>
                        </div>
                    </Form>
                </ModalBody>
            </Modal>

            <Modal isOpen={modalEdit} toggle={() => toggleEdit(null)} centered size="lg">
                <ModalHeader toggle={() => toggleEdit(null)}>
                    <FaEdit style={{ marginRight: '10px' }} /> Edit Stock Item
                </ModalHeader>
                <ModalBody>
                    <Form>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="editItemName" className="form-label">
                                        Item Name
                                    </Label>
                                    <Input
                                        type="text"
                                        name="itemName"
                                        id="editItemName"
                                        value={formData.itemName}
                                        onChange={handleChange}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="editItemLocation" className="form-label">
                                        Item Location
                                    </Label>
                                    <Input
                                        type="select"
                                        name="itemLocation"
                                        id="editItemLocation"
                                        value={formData.itemLocation}
                                        onChange={handleChange}
                                    >
                                        <option>Storage 1</option>
                                        <option>Storage 2</option>
                                    </Input>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="editInitialStock" className="form-label">
                                        Initial
                                    </Label>
                                    <Input
                                        type="number"
                                        name="initial"
                                        id="editInitialStock"
                                        value={formData.initial}
                                        onChange={handleChange}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="editSoldStock" className="form-label">
                                        Sold
                                    </Label>
                                    <Input
                                        type="number"
                                        name="sold"
                                        id="editSoldStock"
                                        value={formData.sold}
                                        onChange={handleChange}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <div className="text-center mt-3">
                            <Button className="btn-modal-action" onClick={handleEditItem} style={{ width: 'auto', paddingLeft: '40px', paddingRight: '40px' }}>
                                Edit Item
                            </Button>
                        </div>
                    </Form>
                </ModalBody>
            </Modal>

            <Modal isOpen={modalDelete} toggle={() => toggleDelete(null)} centered>
                <ModalBody>
                    <div className="modal-delete-content">
                        <h4 style={{ fontWeight: 'bold', color: '#2c3e50' }}>Are you sure ?</h4>
                        <div className="modal-delete-actions">
                            <button className="btn-delete-confirm" onClick={handleDeleteItem}>
                                Delete
                            </button>
                            <button className="btn-delete-cancel" onClick={() => toggleDelete(null)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </div>
    );
};