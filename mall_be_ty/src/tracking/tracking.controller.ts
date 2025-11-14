import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { TrackingService } from './tracking.service';
import { Tracking, TrackingStatus } from 'src/order/entities/orderTracking.entity';

@Controller('tracking')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

   // Create tracking for an order
  @Post(':orderId')
  createTracking(@Param('orderId') orderId: number): Promise<Tracking> {
    return this.trackingService.createForOrder(orderId);
  }

  // Update tracking status
  @Patch(':trackingId/status')
  updateStatus(
    @Param('trackingId') trackingId: string,
    @Body('status') status: TrackingStatus,
  ): Promise<Tracking> {
    return this.trackingService.updateStatus(trackingId, status);
  }

  // Get tracking info by tracking ID
  @Get(':trackingId')
  getTracking(@Param('trackingId') trackingId: string): Promise<Tracking> {
    return this.trackingService.findByTrackingId(trackingId);
  }

  // Get tracking info by order ID
  @Get('order/:orderId')
  getTrackingByOrder(@Param('orderId') orderId: number): Promise<Tracking> {
    return this.trackingService.findByOrderId(orderId);
  }
}
