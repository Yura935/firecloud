import { IOrder } from '../interfaces/order.interface';

export class Order implements IOrder {
    constructor(
        public id: number,
        public userName: string,
        public userEmail: string,
        public date: Date,
        public userNumber: number,
        public userLocation: string,
        public payment: string,
    ) { }

}