import { v4 as uuidv4 } from 'uuid';

interface Order {
    id: string;
    videoUrl: string;
    status: 'pending' | 'converted' | 'failed';
    filePath?: string;
    originalVideoUrl?: string;
    error?: string;
    audioFormat?: 'mono-mp3'; // Можно расширить для других форматов
}
const orders = new Map<string, Order>();

export const createOrder = (videoUrl: string): Order => {
    const id = uuidv4();
    const order: Order = { id, videoUrl, status: 'pending' };
    orders.set(id, order);
    return order;
};

export const getOrder = (id: string): Order | undefined => {
    return orders.get(id);
};

export const updateOrder = (id: string, updates: Partial<Order>): void => {
    const order = orders.get(id);
    if (order) {
        orders.set(id, { ...order, ...updates });
    }
};
