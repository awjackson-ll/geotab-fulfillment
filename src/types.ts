export interface SuperTag {
  [key: string]: any; // Dynamic properties from API
}

export interface AuthState {
  username: string;
  isAuthenticated: boolean;
  token?: string;
}

export interface ColumnVisibility {
  [key: string]: boolean;
}

export interface Site {
  id: string;
  value: string;
  [key: string]: any;
}

export interface Organization {
  id: string;
  value: string;
  [key: string]: any;
}

export interface PendingOrder {
  id: string;
  value: string;
  [key: string]: any;
}

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
  id: string;
  value: string;
  [key: string]: any;
}

export interface TagEvent {
  uuid: string;
  time: string;
  type: string;
  metadata: {
    props: Record<string, any>;
    tags: any[];
  };
  value: Record<string, any>;
  [key: string]: any;
}

export interface TagEventHistory {
  queryUrl: { href: string };
  subjectType: string;
  subject: string;
  queryTime: string;
  maxWTime: string;
  minWTime: string;
  resultCount: number;
  moreRecordsExist: boolean;
  nextPageId: string | null;
  results: TagEvent[];
}

export interface MsgTypeMap {
  [key: string]: string;
}