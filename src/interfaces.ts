interface Base {
  createdAt: string;
  updatedAt: string;
}

export interface Provider extends Base {
  id: number;
  name: string;
  address: string;
}

export interface User extends Base {
  id: number;
  username: string;
  token: string;
  person: Person;
}

export interface Person extends Base {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface Product extends Base {
  id: number;
  code: string;
  stock: number;
  price: number;
  measures: string;
  place: {
    id: number;
    name: string;
  };
  brand: {
    id: number;
    name: string;
  };
}

interface ProductShort {
  id: number,
  code: string,
  stock: number,
  measures: string,
  price: number,
}

export interface Place extends Base {
  id: number;
  name: string;
  description?: string;
  products: ProductShort[];
}

export interface Brand extends Base {
  id: number;
  name: string;
  description?: string;
  products: ProductShort[];
}