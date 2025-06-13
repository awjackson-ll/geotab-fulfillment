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
    <div className="flex flex-col w-full font-[Roboto]">
      <div className="text-[14px] font-[600] text-white m-0 p-0 w-full h-[48px] bg-[#3C5063] flex items-center leading-[1rem] tracking-normal flex-grow shadow-sm sticky top-9">
        <p className="m-0 p-0 pl-4">Orders</p>
      </div>
      <div>
        {orders.map((order) => (
          <div
            key={order.orderHeaderId}
            className="pt-1 pb-1 pl-4 w-full h-fit cursor-pointer box-border border-1 border-solid border-[#E0E0E0] hover:bg-[#F0F2F7]"
            onClick={() => handleNext()}
          >
            <table>
              <tbody>
                <tr>
                  <td className="text-[#0062a9] font-[Roboto] text-[0.875rem] leading-[1rem] font-[500] tracking-[.16px]">{order.shipmentReference}</td>
                  <td></td>
                </tr>
                <tr>
                  <td className="min-w-[112px] font-[Roboto] text-[0.75rem] leading-[1rem] font-[400] tracking-[.32px]">PO Number:</td>
                  <td className="font-[Roboto] text-[0.875rem] leading-[1rem] font-[400] tracking-[0px]">{order.purchaseOrderNumber}</td>
                </tr>
                <tr>
                  <td className="min-w-[112px] font-[Roboto] text-[0.75rem] leading-[1rem] font-[400] tracking-[.32px]">Status:</td>
                  <td className="font-[Roboto] text-[0.875rem] leading-[1rem] font-[400] tracking-[0px]">{order.shipmentStatus}</td>
                </tr>
                <tr>
                  <td className="min-w-[112px] font-[Roboto] text-[0.75rem] leading-[1rem] font-[400] tracking-[.32px]">Customer:</td>
                  <td className="font-[Roboto] text-[0.875rem] leading-[1rem] font-[400] tracking-[0px]">{order.shippingContact.name}</td>
                </tr>
                <tr>
                  <td className="min-w-[112px] font-[Roboto] text-[0.75rem] leading-[1rem] font-[400] tracking-[.32px]">Customer Email:</td>
                  <td className="text-[#575757] font-[Roboto] text-[0.75rem] leading-[1rem] font-[400] tracking-[.32px]">{order.shippingContact.email}</td>
                </tr>
                <tr>
                  <td className="min-w-[112px] font-[Roboto] text-[0.75rem] leading-[1rem] font-[400] tracking-[.32px]">Partner:</td>
                  <td className="font-[Roboto] text-[0.875rem] leading-[1rem] font-[400] tracking-[0px]">{order.resellerName}</td>
                </tr>
                <tr>
                  <td className="min-w-[112px] font-[Roboto] text-[0.75rem] leading-[1rem] font-[400] tracking-[.32px]"></td>
                  <td className="text-[#575757] font-[Roboto] text-[0.75rem] leading-[1rem] font-[400] tracking-[.32px]">{order.resellerEmail}</td>
                </tr>
                <tr>
                  <td className="min-w-[112px] font-[Roboto] text-[0.75rem] leading-[1rem] font-[400] tracking-[.32px]">Order Date:</td>
                  <td className="font-[Roboto] text-[0.875rem] leading-[1rem] font-[400] tracking-[0px]">{formatDate(order.orderDate)}</td>
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
      <p className="bg-[white] sticky top-0 font-[600] text-[24px]">{stepConfig.title}</p>
      <div>
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
