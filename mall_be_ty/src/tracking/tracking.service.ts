import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/order/entities/order.entity';
import { Tracking, TrackingStatus } from 'src/order/entities/orderTracking.entity';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';

@Injectable()
export class TrackingService {
    constructor(
    @InjectRepository(Tracking)
    private readonly trackingRepo: Repository<Tracking>,
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  async createForOrder(orderId: number): Promise<Tracking> {
    const order = await this.orderRepo.findOne({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');

    const tracking = this.trackingRepo.create({
      trackingId: v4(),
      status: TrackingStatus.PENDING,
      order,
    });

    return this.trackingRepo.save(tracking);
  }

  async updateStatus(trackingId: string, status: TrackingStatus): Promise<Tracking> {
    const tracking = await this.trackingRepo.findOne({ where: { trackingId }, relations: ['order'] });
    if (!tracking) throw new NotFoundException('Tracking record not found');

    tracking.status = status;

    // Optional timeline stamps
    if (status === TrackingStatus.SHIPPING) tracking.shippedAt = new Date();
    if (status === TrackingStatus.DELIVERED) tracking.deliveredAt = new Date();
    if (status === TrackingStatus.FAILED) tracking.failedAt = new Date();

    return this.trackingRepo.save(tracking);
  }

  async findByTrackingId(trackingId: string): Promise<Tracking> {
    const tracking = await this.trackingRepo.findOne({
      where: { trackingId },
      relations: ['order'],
    });
    if (!tracking) throw new NotFoundException('Tracking record not found');
    return tracking;
  }

  async findByOrderId(orderId: number): Promise<Tracking> {
    const tracking = await this.trackingRepo.findOne({
      where: { order: { id: orderId } },
      relations: ['order'],
    });
    if (!tracking) throw new NotFoundException('Tracking not found for this order');
    return tracking;
  }
}
