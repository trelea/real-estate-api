import { Column, Entity, JoinColumn, OneToOne, Unique } from 'typeorm';
import { GlobalEntityIncrement } from './_';
import { Service } from './service';

@Entity()
@Unique(['service'])
export class ServiceLanding extends GlobalEntityIncrement {
  @OneToOne(() => Service, (service) => service.landing, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  service: Service;

  @Column({ type: 'integer', nullable: false })
  position: number;
}
