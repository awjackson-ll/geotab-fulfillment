import React, { useState, useEffect } from 'react';
import { myAdminApi } from '../services/geotabAPI';

// Type definitions for the order data
interface Account {
  accountId: string;
  id: number;
}

interface ShippingContact {
  name: string;
  email: string;
  street1: string;
  street2: string;
  city: string;
  state: string;
  zipCode: string;
  telephone1: string;
  telephone2: string;
}

export interface Order {
  orderHeaderId: number;
  account: Account;
  orderDate: string; // ISO date string
  shipmentStatus: string;
  comment: string;
  shippingContact: ShippingContact;
  resellerName: string;
  resellerEmail: string;
  purchaseOrderNumber: string;
  shipmentReference: string;
  validated: boolean;
  id: number;
}

interface FormattedOrdersDisplayProps {
  orders: Order[];
  handleNext: () => void;
}

// Helper function to format date
const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  try {
    return dateString.slice(0, 10)
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString; // Return original string if formatting fails
  }
};

export const FormattedOrdersDisplay: React.FC<FormattedOrdersDisplayProps> = ({ orders, handleNext }) => {
  if (!orders || orders.length === 0) {
    return <p style={{ textAlign: 'center', color: '#666' }}>No orders to display.</p>;
  }

  return (
    <div className="geotabOrderContainer">
      <div className="geotabOrderBanner">
        <p>Orders</p>
      </div>
      <div className="geotabOrders">
        {orders.map((order) => (
          <div
            key={order.orderHeaderId}
            className="geotabOrderTable"
            onClick={() => handleNext()}
          >
            <table>
              <tbody>
                <tr>
                  <td className="geotabShipmentReference">{order.shipmentReference}</td>
                  <td></td>
                </tr>
                <tr>
                  <td className="geotabOrderLabel">PO Number:</td>
                  <td className="geotabOrderValue">{order.purchaseOrderNumber}</td>
                </tr>
                <tr>
                  <td className="geotabOrderLabel">Status:</td>
                  <td className="geotabOrderValue">{order.shipmentStatus}</td>
                </tr>
                <tr>
                  <td className="geotabOrderLabel">Customer:</td>
                  <td className="geotabOrderValue">{order.shippingContact.name}</td>
                </tr>
                <tr>
                  <td className="geotabOrderLabel"></td>
                  <td className="geotabOrderEmail">{order.shippingContact.email}</td>
                </tr>
                <tr>
                  <td className="geotabOrderLabel">Partner:</td>
                  <td className="geotabOrderValue">{order.resellerName}</td>
                </tr>
                <tr>
                  <td className="geotabOrderLabel"></td>
                  <td className="geotabOrderEmail">{order.resellerEmail}</td>
                </tr>
                <tr>
                  <td className="geotabOrderLabel">Order Date:</td>
                  <td className="geotabOrderValue">{formatDate(order.orderDate)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

function GeotabPendingOrder({ data, setData, onNavigate, stepConfig }: any) {
  const [localData, setLocalData] = useState(data[stepConfig.id] || { name: '', email: '' });
  const [pendingOrders, setPendingOrders] = useState<Order[] | null>(null);

  async function getPendingOrders() {
    try {
      const sessionId = localStorage.getItem("myAdminSessionId");
      if (sessionId) {
        const orders = await myAdminApi.getPendingOrders(sessionId);
        setPendingOrders(orders);
      } else {
        console.error("Session ID not found.");
        setPendingOrders([]); 
      }
    } catch (error) {
      console.error("Error fetching pending orders:", error);
      setPendingOrders([]); 
    }
  }

  async function getAllOrders() {
    try {
      const sessionId = localStorage.getItem("myAdminSessionId");
      if (sessionId) {
        const orders = await myAdminApi.getAllOrders(sessionId);
        setPendingOrders(orders);
      } else {
        console.error("Session ID not found.");
        setPendingOrders([]); 
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setPendingOrders([]); 
    }
  }
  
  useEffect(() => {
    setLocalData(data[stepConfig.id] || { name: '', email: '' });
  }, [data, stepConfig.id]);

  useEffect(() => {
    // getPendingOrders();
    getAllOrders();
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setLocalData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (!localData.name || !localData.email) { // Assuming these fields are still relevant from original component structure
      alert("Please fill in all fields for Step 1.");
      return;
    }
    setData((prevData: any) => ({ ...prevData, [stepConfig.id]: localData }));
    if (stepConfig.nextStepId) {
      onNavigate(stepConfig.nextStepId);
    } else {
      alert("No next step defined from here. Consider this a submission point or add nextStepId.");
    }
  };

  return (
    <>
      <p className="configStepTitle">{stepConfig.title}</p>
      <div className="geotabContainer">
        {pendingOrders === null ? (
          <p>Loading orders...</p>
        ) : (
          <FormattedOrdersDisplay orders={pendingOrders} handleNext={handleNext}/>
        )}
      </div>
    </>
  );
}

export default GeotabPendingOrder;
