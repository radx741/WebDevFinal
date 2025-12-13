import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { Container, Row, Col, Card, CardBody, CardTitle } from "reactstrap";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    PieChart,
    Pie,
    Legend,
    Cell,
    LineChart,
    Line,
    ResponsiveContainer,
} from "recharts";
import "./Dashboard.css";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export const Dashboard = () => {
    const stockItems = useSelector((state) => state.stock.stockItems);
    const orders = useSelector((state) => state.orders.orders);
    const canceledCount = useSelector((state) => state.orders.canceledCount);

    // A) Stock Quantity Chart Data
    const stockData = useMemo(() => {
        if (!stockItems || stockItems.length === 0) return [];
        return stockItems.map((item) => ({
            name: item.itemName,
            quantity: item.remaining,
        }));
    }, [stockItems]);

    // B) Orders by Status Data
    const ordersStatusData = useMemo(() => {
        if ((!orders || orders.length === 0) && !canceledCount) return [];

        const statusCount = {
            Delivered: 0,
            Pending: 0,
            Canceled: canceledCount || 0,
        };

        if (orders) {
            orders.forEach((order) => {
                if (order.status in statusCount) {
                    statusCount[order.status]++;
                }
            });
        }

        return Object.entries(statusCount).map(([name, value]) => ({
            name,
            value,
        }));
    }, [orders, canceledCount]);

    // C) Orders Per Day Data
    const ordersPerDayData = useMemo(() => {
        if (!orders || orders.length === 0) return [];

        const dateCount = {};

        orders.forEach((order) => {
            if (order.date) {
                const date = new Date(order.date).toISOString().split("T")[0];
                dateCount[date] = (dateCount[date] || 0) + 1;
            }
        });

        return Object.entries(dateCount)
            .map(([date, count]) => ({
                date,
                count,
            }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [orders]);

    return (
        <Container className="dashboard-container">
            <Row className="mb-4">
                <Col md="6">
                    <Card className="dashboard-card">
                        <CardBody>
                            <CardTitle tag="h5" className="dashboard-card-title">Stock Quantity</CardTitle>
                            {stockData.length === 0 ? (
                                <p>No data available</p>
                            ) : (
                                <div className="chart-container" style={{ width: "100%", height: "300px" }}>
                                    <ResponsiveContainer>
                                        <BarChart data={stockData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="quantity" fill="#8884d8" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </Col>
                <Col md="6">
                    <Card className="dashboard-card">
                        <CardBody>
                            <CardTitle tag="h5" className="dashboard-card-title">Orders by Status</CardTitle>
                            {ordersStatusData.length === 0 ? (
                                <p>No data available</p>
                            ) : (
                                <div className="chart-container" style={{ width: "100%", height: "300px" }}>
                                    <ResponsiveContainer>
                                        <PieChart>
                                            <Pie
                                                data={ordersStatusData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={(entry) => `${entry.name}: ${entry.value}`}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {ordersStatusData.map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={COLORS[index % COLORS.length]}
                                                    />
                                                ))}
                                            </Pie>
                                            <Legend />
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col md="12">
                    <Card className="dashboard-card">
                        <CardBody>
                            <CardTitle tag="h5" className="dashboard-card-title">Orders Per Day</CardTitle>
                            {ordersPerDayData.length === 0 ? (
                                <p>No data available</p>
                            ) : (
                                <div className="chart-container" style={{ width: "100%", height: "300px" }}>
                                    <ResponsiveContainer>
                                        <LineChart data={ordersPerDayData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Line
                                                type="monotone"
                                                dataKey="count"
                                                stroke="#8884d8"
                                                strokeWidth={2}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Dashboard;