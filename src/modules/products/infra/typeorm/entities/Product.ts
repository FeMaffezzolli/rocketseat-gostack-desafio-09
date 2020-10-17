import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import OrdersProducts from '@modules/orders/infra/typeorm/entities/OrdersProducts';

@Entity({ name: 'products' })
class Product {
  @PrimaryGeneratedColumn({ type: 'uuid' })
  id: string;

  @Column()
  name: string;

  @Column({ type: 'decimal', scale: 6, precision: 2 })
  price: number;

  @Column({ type: 'int' })
  quantity: number;

  @OneToMany(() => OrdersProducts, orderProducts => orderProducts.product)
  order_products: OrdersProducts[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Product;
