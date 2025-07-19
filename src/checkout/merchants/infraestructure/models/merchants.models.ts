import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IMerchantPaymentModel } from '../../dominio/entities/merchants.entites';

@Entity('merchan_payment_result')
export class MerchantPaymentModel implements IMerchantPaymentModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  reference: string;

  @Column({ type: 'varchar', length: 50 })
  status: string;

  @Column({ type: 'text', nullable: true })
  status_message: string | null;

  @Column({ type: 'jsonb' })
  payment_method: any;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount_in_cents: number;

  @Column({ type: 'varchar', length: 3 })
  currency: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  customer_email: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  payment_link_id: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  bill_id: string | null;

  @CreateDateColumn()
  created_at: Date;
}
