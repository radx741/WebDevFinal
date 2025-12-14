import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
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
    Row,
    Col,
} from 'reactstrap';
import { FaShoppingCart, FaEdit, FaTrash, FaPlus, FaCheckCircle, FaClock } from 'react-icons/fa';
import { fetchOrders, addOrder, updateOrder, deleteOrder } from '../../../../features/OrderSlice';
import { fetchItems } from '../../../../features/StockSlice';
import './Orders.css';

export const Orders = () => {
    const dispatch = useDispatch();
    const { orders } = useSelector((state) => state.orders);
    const { stockItems } = useSelector((state) => state.stock);

    const [modalAdd, setModalAdd] = useState(false);
    const [modalEdit, setModalEdit] = useState(false);
    const [modalDelete, setModalDelete] = useState(false);

    const [currentOrder, setCurrentOrder] = useState(null);
    const [formData, setFormData] = useState({
        customer: '',
        item: '',
        phone: '',
        status: '',
        address: '',
        payment: '',
        itemNumber: '',
    });

    useEffect(() => {
        dispatch(fetchOrders());
        dispatch(fetchItems());
    }, [dispatch]);

    const toggleAdd = () => {
        setModalAdd(!modalAdd);
        setFormData({ customer: '', item: '', phone: '', status: '', address: '', payment: '', itemNumber: '' });
    };

    const toggleEdit = (order) => {
        if (order) {
            setCurrentOrder(order);
            setFormData({
                customer: order.customer,
                item: order.item,
                phone: order.phone,
                status: order.status,
                address: order.address,
                payment: order.payment,
                itemNumber: order.itemNumber || '',
            });
        }
        setModalEdit(!modalEdit);
    };

    const toggleDelete = (order) => {
        if (order) setCurrentOrder(order);
        setModalDelete(!modalDelete);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Validate itemNumber doesn't exceed available stock
        if (name === 'itemNumber') {
            // Allow empty value for clearing/typing
            if (value === '') {
                setFormData({ ...formData, [name]: '' });
                return;
            }

            const selectedItem = stockItems.find(s => s.itemName === formData.item);
            // Only validate if an item is selected
            if (selectedItem) {
                let maxStock = selectedItem.remaining || 0;

                // If editing and the selected item matches the current order's item, add back the current quantity
                if (currentOrder && currentOrder.item === formData.item) {
                    maxStock += (currentOrder.itemNumber || 0);
                }

                const numValue = parseInt(value) || 0;

                if (numValue > maxStock) {
                    setFormData({ ...formData, [name]: maxStock.toString() });
                    return;
                }
                if (numValue < 0) {
                    setFormData({ ...formData, [name]: '0' });
                    return;
                }
            }

            setFormData({ ...formData, [name]: value });
            return;
        }

        // Reset itemNumber when item changes
        if (name === 'item') {
            setFormData({ ...formData, [name]: value, itemNumber: '' });
            return;
        }

        setFormData({ ...formData, [name]: value });
    };

    const handleAddOrder = () => {
        const newOrder = {
            ...formData,
            itemNumber: parseInt(formData.itemNumber) || 1,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        };
        dispatch(addOrder(newOrder));
        toggleAdd();
    };

    const handleEditOrder = () => {
        dispatch(updateOrder({ id: currentOrder._id, orderData: formData }));
        toggleEdit(null);
    };

    const handleDeleteOrder = () => {
        dispatch(deleteOrder(currentOrder._id));
        toggleDelete(null);
    };

    const getStatusBadge = (status) => {
        if (status === 'Delivered') {
            return <span className="badge-base status-delivered"><FaCheckCircle /> Delivered</span>;
        }
        return <span className="badge-base status-pending"><FaClock /> Pending</span>;
    };

    const getPaymentBadge = (payment) => {
        if (payment === 'Paid') {
            return <span className="badge-base payment-paid"><FaCheckCircle /> Paid</span>;
        }
        return <span className="badge-base payment-unpaid"><FaClock /> Unpaid</span>;
    };

    return (
        <div className="orders-container">
            <div className="orders-header">
                <h2>Order Management</h2>
                <Button className="btn-new-order" onClick={toggleAdd}>
                    <FaPlus style={{ marginRight: '5px' }} /> Add Order
                </Button>
            </div>

            <Card className="orders-overview-card">
                <div className="orders-overview-header">
                    <FaShoppingCart /> Orders Overview
                </div>
                <Table responsive hover className="orders-table mb-0">
                    <thead>
                        <tr>
                            <th>Customer</th>
                            <th>phone</th>
                            <th>Address</th>
                            <th>Item name</th>
                            <th>Status</th>
                            <th>Payment</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id}>
                                <td>{order.customer}</td>
                                <td>{order.phone}</td>
                                <td>{order.address}</td>
                                <td>{order.item}</td>
                                <td>{getStatusBadge(order.status)}</td>
                                <td>{getPaymentBadge(order.payment)}</td>
                                <td>{order.date}</td>
                                <td>
                                    <button className="action-btn" onClick={() => toggleEdit(order)} title="Edit">
                                        <FaEdit />
                                    </button>
                                    {!(order.status === 'Delivered' && order.payment === 'Paid') && (
                                        <button className="action-btn" onClick={() => toggleDelete(order)} title="Delete">
                                            <FaTrash />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>

            <Modal isOpen={modalAdd} toggle={toggleAdd} centered size="lg">
                <ModalHeader toggle={toggleAdd}>
                    <FaPlus style={{ marginRight: '10px' }} /> Add Order
                </ModalHeader>
                <ModalBody>
                    <Form>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="customer" className="form-label">Customer</Label>
                                    <Input type="text" name="customer" id="customer" value={formData.customer} onChange={handleChange} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="item" className="form-label">Item Name</Label>
                                    <Input type="select" name="item" id="item" value={formData.item} onChange={handleChange}>
                                        <option value="">Select Item</option>
                                        {stockItems.map((stockItem) => (
                                            <option key={stockItem._id} value={stockItem.itemName}>
                                                {stockItem.itemName}
                                            </option>
                                        ))}
                                    </Input>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="phone" className="form-label">Phone</Label>
                                    <Input type="text" name="phone" id="phone" value={formData.phone} onChange={handleChange} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="itemNumber" className="form-label">Item Number</Label>
                                    <Input
                                        type="number"
                                        name="itemNumber"
                                        id="itemNumber"
                                        value={formData.itemNumber}
                                        onChange={handleChange}
                                        min="1"
                                        max={stockItems.find(s => s.itemName === formData.item)?.remaining || 0}
                                        disabled={!formData.item}
                                    />
                                    {formData.item && (
                                        <small className="text-muted">
                                            Available in stock: {stockItems.find(s => s.itemName === formData.item)?.remaining || 0}
                                        </small>
                                    )}
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="status" className="form-label">Status</Label>
                                    <Input type="select" name="status" id="status" value={formData.status} onChange={handleChange}>
                                        <option value="">Select Status</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Pending">Pending</option>
                                    </Input>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="address" className="form-label">Address</Label>
                                    <Input type="text" name="address" id="address" value={formData.address} onChange={handleChange} />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="payment" className="form-label">Payment</Label>
                                    <Input type="select" name="payment" id="payment" value={formData.payment} onChange={handleChange}>
                                        <option value="">Select Payment</option>
                                        <option value="Paid">Paid</option>
                                        <option value="Unpaid">Unpaid</option>
                                    </Input>
                                </FormGroup>
                            </Col>
                        </Row>
                        <div className="text-end mt-3">
                            <Button className="btn-modal-action" onClick={handleAddOrder} style={{ width: 'auto', paddingLeft: '30px', paddingRight: '30px' }}>
                                Add Order
                            </Button>
                        </div>
                    </Form>
                </ModalBody>
            </Modal>

            <Modal isOpen={modalEdit} toggle={() => toggleEdit(null)} centered size="lg">
                <ModalHeader toggle={() => toggleEdit(null)}>
                    <FaEdit style={{ marginRight: '10px' }} /> Edit Order
                </ModalHeader>
                <ModalBody>
                    <Form>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="editCustomer" className="form-label">Customer</Label>
                                    <Input type="text" name="customer" id="editCustomer" value={formData.customer} onChange={handleChange} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="editItem" className="form-label">Item name</Label>
                                    <Input type="text" name="item" id="editItem" value={formData.item} onChange={handleChange} />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="editPhone" className="form-label">Phone</Label>
                                    <Input type="text" name="phone" id="editPhone" value={formData.phone} onChange={handleChange} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="editItemNumber" className="form-label">Item Number</Label>
                                    <Input
                                        type="number"
                                        name="itemNumber"
                                        id="editItemNumber"
                                        value={formData.itemNumber}
                                        onChange={handleChange}
                                        min="1"
                                        max={(stockItems.find(s => s.itemName === formData.item)?.remaining || 0) + (currentOrder && currentOrder.item === formData.item ? (currentOrder.itemNumber || 0) : 0)}
                                        disabled={!formData.item}
                                    />
                                    {formData.item && (
                                        <small className="text-muted">
                                            Available in stock: {(stockItems.find(s => s.itemName === formData.item)?.remaining || 0) + (currentOrder && currentOrder.item === formData.item ? (currentOrder.itemNumber || 0) : 0)}
                                        </small>
                                    )}
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="editStatus" className="form-label">Status</Label>
                                    <Input type="select" name="status" id="editStatus" value={formData.status} onChange={handleChange}>
                                        <option value="">Select Status</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Pending">Pending</option>
                                    </Input>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="editAddress" className="form-label">Address</Label>
                                    <Input type="text" name="address" id="editAddress" value={formData.address} onChange={handleChange} />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="editPayment" className="form-label">Payment</Label>
                                    <Input type="select" name="payment" id="editPayment" value={formData.payment} onChange={handleChange}>
                                        <option value="">Select Payment</option>
                                        <option value="Paid">Paid</option>
                                        <option value="Unpaid">Unpaid</option>
                                    </Input>
                                </FormGroup>
                            </Col>
                        </Row>
                        <div className="text-end mt-3">
                            <Button className="btn-modal-action" onClick={handleEditOrder} style={{ width: 'auto', paddingLeft: '30px', paddingRight: '30px' }}>
                                Edit Order
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
                            <button className="btn-delete-confirm" onClick={handleDeleteOrder}>
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