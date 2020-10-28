import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    // TODO
    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) {
      throw new AppError('Customer not found', 404);
    }

    const fetchedProducts = await this.productsRepository.findAllById(
      products.map(p => ({ id: p.id })),
    );

    const productsVector: Array<{
      product_id: string;
      price: number;
      quantity: number;
    }> = [];

    fetchedProducts.forEach(product => {
      const passedProduct = products.find(p => p.id === product.id);
      if (!passedProduct) return;
      const productOrder = {
        product_id: product.id,
        price: product.price,
        quantity: passedProduct.quantity,
      };
      productsVector.push(productOrder);
    });

    const order = await this.ordersRepository.create({
      customer,
      products: productsVector,
    });

    return order;
  }
}

export default CreateOrderService;
