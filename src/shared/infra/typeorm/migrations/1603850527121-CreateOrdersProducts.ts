import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

class CreateOrdersProducts1603850527121 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'orders_products',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            isGenerated: true,
            isUnique: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'price',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'quantity',
            type: 'int',
          },
          {
            name: 'order_id',
            type: 'uuid',
          },
          {
            name: 'product_id',
            type: 'uuid',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'orders_products',
      new TableForeignKey({
        columnNames: ['order_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'orders',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'orders_products',
      new TableForeignKey({
        columnNames: ['product_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'products',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('orders_products');
    if (!table) return;
    const orderForeignKey = table.foreignKeys.find(
      fk => fk.columnNames.indexOf('order_id') !== -1,
    );
    if (orderForeignKey) {
      await queryRunner.dropForeignKey('orders_products', orderForeignKey);
    }
    const productForeignKey = table.foreignKeys.find(
      fk => fk.columnNames.indexOf('product_id') !== -1,
    );
    if (productForeignKey) {
      await queryRunner.dropForeignKey('orders_products', productForeignKey);
    }

    await queryRunner.dropTable('orders_products');
  }
}

export default CreateOrdersProducts1603850527121;
