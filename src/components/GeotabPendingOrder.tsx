import React, { useState, useEffect } from 'react';
import { myAdminApi } from '../services/geotabAPI';
import type { Order } from '../types';
import { ArrowDown10, ArrowUp01, CalendarArrowDown, CalendarArrowUp } from 'lucide-react';


function GeotabPendingOrder({ data, setData, onNavigate, stepConfig }: any) {
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [displayedOrders, setDisplayedOrders] = useState<Order[]>([]);
  const [sortOptionsVisible, setSortOptionsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Sort state
  const [sortConfig, setSortConfig] = useState<{key: string, direction: 'ascending' | 'descending'}>({
    key: 'orderDate',
    direction: 'descending'
  });
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  
  // Search state
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    async function getAllOrders() {
      try {
        const sessionId = localStorage.getItem("myAdminSessionId");
        const currentDate = new Date();
        const oneYearAgo = new Date()
        oneYearAgo.setFullYear(currentDate.getFullYear() - 1);
        if (sessionId) {
          const params = {
            sessionId: sessionId,
            fromDate: oneYearAgo,
            toDate: currentDate
          };
          const orders = await myAdminApi.getOrders(params);
          setAllOrders(orders);
        } else {
          console.error("Session ID not found.");
          setAllOrders([]); 
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setAllOrders([]); 
      }
    }
    
    getAllOrders();
  }, []);

  // Apply filters, search, and sort
  useEffect(() => {
    let result = [...allOrders];
    
    // Apply status filter
    if (statusFilter) {
      result = result.filter(order => 
        order.shipmentStatus.toLowerCase() === statusFilter.toLowerCase());
    }
    
    // Apply date range filter
    if (startDate) {
      const startDateTime = new Date(startDate).getTime();
      result = result.filter(order => 
        new Date(order.orderDate).getTime() >= startDateTime);
    }
    
    if (endDate) {
      const endDateTime = new Date(endDate).getTime() + (24 * 60 * 60 * 1000); // Include full day
      result = result.filter(order => 
        new Date(order.orderDate).getTime() <= endDateTime);
    }
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(order => 
        // Search through all relevant fields
        order.purchaseOrderNumber?.toLowerCase().includes(query) ||
        order.shipmentReference?.toLowerCase().includes(query) ||
        order.comment?.toLowerCase().includes(query) ||
        order.shippingContact?.name?.toLowerCase().includes(query) ||
        order.resellerName?.toLowerCase().includes(query) ||
        order.shippingContact?.email?.toLowerCase().includes(query) ||
        order.resellerEmail?.toLowerCase().includes(query) ||
        order.shippingContact?.city?.toLowerCase().includes(query)
      );
    }
    
    // Apply sort
    if (sortConfig.key) {
      result.sort((a, b) => {
        
        // Handle string vs date vs number comparison
        if (a[sortConfig.key] === b[sortConfig.key]) return 0;
        
        if (sortConfig.key === 'orderDate') {
          // Date comparison
          const dateA = new Date(a[sortConfig.key] || '').getTime();
          const dateB = new Date(b[sortConfig.key] || '').getTime();
          return sortConfig.direction === 'ascending' ? dateA - dateB : dateB - dateA;
        }
        
        // String comparison with null handling
        const valA = String(a[sortConfig.key] || '').toLowerCase();
        const valB = String(b[sortConfig.key] || '').toLowerCase();
        return sortConfig.direction === 'ascending' 
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      });
    }
    
    setDisplayedOrders(result);
  }, [allOrders, sortConfig, statusFilter, startDate, endDate, searchQuery]);

  // Sort handler
  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'ascending' ? 'descending' : 'ascending'
    }));
  };
  
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

  // Get unique status values for filter dropdown
  const statusOptions = [...new Set(allOrders.map(order => order.shipmentStatus))];

  const handleOrderSelect = (order: Order) => {
    if (!order) {
      alert("Please select an order.");
      return;
    }
    setData((prevData: any) => ({ ...prevData, [stepConfig.id]: order }));
    if (stepConfig.nextStepId) {
      onNavigate(stepConfig.nextStepId);
    } else {
      alert("No next step defined from here. Consider this a submission point or add nextStepId.");
    }
  };

  const handleSortClick = () => {
    setSortOptionsVisible(!sortOptionsVisible);
  };

  return (
    <>
      <p className="bg-[white] sticky top-0 font-[600] text-[24px]">{stepConfig.title}</p>
      {allOrders.length === 0 ? (
        <p>Loading orders...</p>
      ) : (
        <>
          <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <input
                type="text"
                placeholder="Search all fields..."
                className="w-full p-2 border rounded"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div>
              <select 
                className="w-full p-2 border rounded"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            
            <div className="flex space-x-2">
              <input
                type="date"
                className="flex-1 p-2 border rounded"
                placeholder="Start Date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <input
                type="date"
                className="flex-1 p-2 border rounded"
                placeholder="End Date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          
          <div className="flex flex-col w-full font-[Roboto]">
            <div className="text-[14px] font-[600] text-white m-0 px-4 py-0 w-full h-[48px] bg-[#3C5063] flex flex-row items-center leading-[1rem] tracking-normal flex-grow shadow-sm sticky top-9">
              <p className="m-0 p-0">Orders</p>
              {sortOptionsVisible ? (
                <div className="flex flex-column flex-wrap ml-auto rounded h-fit max-w-[100px]">
                  <button 
                    className={`px-3 py-1 rounded ${sortConfig.key === 'orderDate' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => {handleSort('orderDate'); setSortOptionsVisible(false);}}
                  >
                    Date <CalendarArrowUp />
                  </button>
                  <button 
                    className={`px-3 py-1 rounded ${sortConfig.key === 'orderDate' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => {handleSort('orderDate'); setSortOptionsVisible(false);}}
                  >
                    Date <CalendarArrowDown />
                  </button>
                  <button 
                    className={`px-3 py-1 rounded ${sortConfig.key === 'purchaseOrderNumber' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => {handleSort('purchaseOrderNumber'); setSortOptionsVisible(false);}}
                  >
                    PO # <ArrowUp01 />
                  </button>
                  <button 
                    className={`px-3 py-1 rounded ${sortConfig.key === 'purchaseOrderNumber' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => {handleSort('purchaseOrderNumber'); setSortOptionsVisible(false);}}
                  >
                    PO # <ArrowDown10 />
                  </button>
                  <button 
                    className={`px-3 py-1 rounded ${sortConfig.key === 'shipmentReference' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => {handleSort('shipmentReference'); setSortOptionsVisible(false);}}
                  >
                    SH # <ArrowUp01 />
                  </button>
                  <button 
                    className={`px-3 py-1 rounded ${sortConfig.key === 'shipmentReference' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => {handleSort('shipmentReference'); setSortOptionsVisible(false);}}
                  >
                    SH # <ArrowDown10 />
                  </button>
                </div>
              ) : (
                <div 
                  className="flex flex-row items-center ml-auto justify-between bg-white px-2 py-1 rounded border-1 border-solid border-[#E0E0E0] hover:border-black hover:inset-shadow-[0px_0px_1px_1px_rgba(0,0,0,1)] transition ease-in-out duration-50 hover:cursor-pointer"
                  onClick={() => handleSortClick()}
                >
                  <svg className="stroke-[#3C5063] stroke-1" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" focusable="false" aria-hidden="true">
                    <path d="M21 6H3V5h18v1zm-6 5H3v1h12v-1zm-6 6H3v1h6v-1z"></path>
                  </svg>
                  <p className="m-0 p-0 pl-2 text-[#3C5063]">Sort By</p>
                </div>
              )}
            </div>
            <div>
              {displayedOrders.map((order) => (
                <div
                  key={order.id}
                  className="pt-1 pb-1 pl-4 w-full h-fit cursor-pointer box-border border-1 border-solid border-[#E0E0E0] hover:bg-[#F0F2F7]"
                  onClick={() => handleOrderSelect(order)}
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
        </>
      )}
    </>
  );
}

export default GeotabPendingOrder;
