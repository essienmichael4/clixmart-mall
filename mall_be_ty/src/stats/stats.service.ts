import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MonthHistory } from 'src/product/entities/MonthHistory.entity';
import { YearHistory } from 'src/product/entities/YearHistory.entity';
import { HistoryDataDto } from './dto/response.dto';
import { UserMonthHistory } from 'src/product/entities/UserMonthHistory.entity';
import { UserYearHistory } from 'src/product/entities/UserYearHistory.entity';
import { Order } from 'src/order/entities/order.entity';
import { Product } from 'src/product/entities/product.entity';
import { Store } from 'src/store/entities/store.entity';
import { User } from 'src/user/entities/user.entity';
import { OrderItem } from 'src/order/entities/orderItem.entity';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(MonthHistory) private readonly monthHistoryRepo:Repository<MonthHistory>,
    @InjectRepository(YearHistory) private readonly yearHistoryRepo:Repository<YearHistory>,
    @InjectRepository(UserMonthHistory) private readonly userMonthHistoryRepo:Repository<UserMonthHistory>,
    @InjectRepository(UserYearHistory) private readonly userYearHistoryRepo:Repository<UserYearHistory>,
    @InjectRepository(Order) private readonly orderRepo:Repository<Order>,
    @InjectRepository(OrderItem) private readonly orderItemRepo:Repository<OrderItem>,
    @InjectRepository(Product) private readonly productRepo:Repository<Product>,
    @InjectRepository(Store) private readonly storeRepo:Repository<Store>,
    @InjectRepository(User) private readonly userRepo:Repository<User>,
  ){}

  async getAdminStatistics(from?:string, to?: string){
    const orders = await this.getTotalOrdersCount(from, to)
    const users = await this.getUsersCount(from, to)
    const products = await this.getTotalProductsCount(from, to)
    const stores = await this.getTotalStoresCount(from, to)
    const revenue = await this.getTotalRevenue(from, to)

    return {
      orders,
      products,
      stores,
      users,
      revenue: revenue.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })
    }
  }

  async getStoreStatistics(store:string, from?:string, to?: string){
    const orders = await this.getTotalStoreOrdersCount(store, from, to)
    const revenue = await this.getTotalStoreRevenue(store, from, to)
    const products = await this.getTotalStoreProducts(store, from, to)

    return {
      orders,
      products,
      revenue: revenue.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })
    }
  }

  async getTotalStoreOrdersCount(storeSlug:string, from?:String, to?: String){
    const query = this.orderRepo
      .createQueryBuilder("order")
      .innerJoin("order.orderItems", "orderItem")
      .innerJoin("orderItem.product", "product")
      .innerJoin("product.store", "store")
      .where("store.slug = :slug", { slug: storeSlug })
      .select("COUNT(DISTINCT order.id)", "count")

    if(from) {
      query.andWhere("order.createdAt >= :from", { from: new Date(from as string).toISOString() })
    }

    if(to) {
      query.andWhere("order.createdAt <= :to", { to: new Date(to as string).toISOString() })
    }

    const result = await query.getRawOne()
    return parseInt(result.count, 10)
  }

  async getTotalStoreRevenue(storeSlug:string, from?:string, to?: string){
    const query = this.orderItemRepo
      .createQueryBuilder("orderItem")
      .innerJoin("orderItem.product", "product")
      .innerJoin("product.store", "store")
      .where("store.slug = :slug", { slug: storeSlug })
      .select("SUM(orderItem.price)", "total")

    if(from) {
      query.andWhere("order.createdAt >= :from", { from: new Date(from as string).toISOString() })
    }

    if(to) {
      query.andWhere("order.createdAt <= :to", { to: new Date(to as string).toISOString() })
    }

    const result = await query.getRawOne()
    return result.total ? parseFloat(result.total) : 0;
  }

  async getTotalStoreProducts(storeSlug:string, from?:string, to?: string){
    const query = this.productRepo
      .createQueryBuilder("product")
      .innerJoin("product.store", "store")
      .where("store.slug = :slug", { slug: storeSlug })
      .select("COUNT(product.id)", "count")

    if(from) {
      query.andWhere("order.createdAt >= :from", { from: new Date(from as string).toISOString() })
    }

    if(to) {
      query.andWhere("order.createdAt <= :to", { to: new Date(to as string).toISOString() })
    }

    const result = await query.getRawOne()
    return parseInt(result.count, 10)
  }

  async getTotalOrdersCount(from?:string, to?: string){
    const query = this.orderRepo.createQueryBuilder("order")
     .select("COUNT(order.id)", "count")

    if(from) {
      query.andWhere("order.createdAt >= :from", { from: new Date(from as string).toISOString() })
    }

    if(to) {
      query.andWhere("order.createdAt <= :to", { to: new Date(to as string).toISOString() })
    }

    const result = await query.getRawOne()
    return parseInt(result.count, 10)
  }

  async getTotalRevenue(from?:string, to?: string){
    const query = this.orderRepo.createQueryBuilder("order")
      .select("SUM(order.total)", "revenue")

    if(from) {
      query.andWhere("order.createdAt >= :from", { from: new Date(from as string).toISOString() })
    }

    if(to) {
      query.andWhere("order.createdAt <= :to", { to: new Date(to as string).toISOString() })
    }

    const result = await query.getRawOne()
    return result.revenue ? parseFloat(result.revenue) : 0;
  }

  async getTotalProductsCount(from?:string, to?: string){
    const query = this.productRepo.createQueryBuilder("product")
      .select("COUNT(product.id)", "count")

    if(from) {
      query.andWhere("product.createdAt >= :from", { from: new Date(from as string).toISOString() })
    }

    if(to) {
      query.andWhere("product.createdAt <= :to", { to: new Date(to as string).toISOString() })
    }

    const result = await query.getRawOne()
    return parseInt(result.count, 10)
  }

  async getTotalStoresCount(from?:string, to?: string){
    const query = this.storeRepo.createQueryBuilder("store")
      .select("COUNT(store.id)", "count")

    if(from) {
      query.andWhere("store.createdAt >= :from", { from: new Date(from as string).toISOString() })
    }

    if(to) {
      query.andWhere("store.createdAt <= :to", { to: new Date(to as string).toISOString() })
    }

    const result = await query.getRawOne()
    return parseInt(result.count, 10)
  }

  async getUsersCount(from?:string, to?: string){
    const query = this.userRepo.createQueryBuilder("user")
      .select("COUNT(user.id)", "count")

    if (from) {
      query.andWhere("user.createdAt >= :from", { from: new Date(from as string).toISOString() })
    }

    if (to) {
      query.andWhere("user.createdAt <= :to", { to: new Date(to as string).toISOString() })
    }

    const result = await query.getRawOne()
    return parseInt(result.count, 10)
  }

  async getHistoryData (timeframe: "MONTH" | "YEAR", month:number, year:number){
    if(timeframe === "YEAR"){
        return await this.getYearHistory(year)
    }
    if(timeframe === "MONTH"){
      console.log("here");
      
        return await this.getMonthHistory(month, year)
    }
  }

  async getUserHistoryData (timeframe: "MONTH" | "YEAR", month:number, year:number, userId?:number){
    if(timeframe === "YEAR"){
        return await this.getUserYearHistory(year, userId)
    }
    if(timeframe === "MONTH"){
        return await this.getUserMonthHistory(month, year, userId)
    }
  }

  async getPeriods(){
    const result = await this.monthHistoryRepo.createQueryBuilder("monthHistory")
        .select("DISTINCT monthHistory.year", "year") // Select distinct years
        .orderBy("monthHistory.year", "ASC")
        .getRawMany();

    const years = result.map((el: { year: any }) => el.year);
    
    if (years.length === 0) {
        return [new Date().getFullYear()]; // Return the current year if no years found
    }

    return years;
  };

  async getMonthHistory(month: number, year: number): Promise<HistoryDataDto[]>{
    const result = this.monthHistoryRepo.createQueryBuilder("monthHistory")
      .select("monthHistory.day", "day")
      .addSelect("SUM(monthHistory.products)", "products")
      .addSelect("SUM(monthHistory.stores)", "stores")
      .addSelect("SUM(monthHistory.orders)", "orders")
      .addSelect("SUM(monthHistory.users)", "users")
      .addSelect("SUM(monthHistory.revenue)", "revenue")
      .where("monthHistory.month = :month", { month })
      .andWhere("monthHistory.year = :year", { year });


    result.groupBy("monthHistory.day")
        .orderBy("day", "ASC");

    const aggregatedResult = await result.getRawMany();

    if (!aggregatedResult || aggregatedResult.length === 0) return [];

    const history: HistoryDataDto[] = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // Get days in month

    for (let i = 1; i <= daysInMonth; i++) {
      let products = 0;
      let stores = 0;
      let orders = 0;
      let users = 0;
      let revenue = 0;

      const dayData = aggregatedResult.find((row: { day: number }) => row.day === i);
      if (dayData) {
        products = dayData.products || 0;
        stores = dayData.stores || 0;
        users = dayData.users || 0;
        orders = dayData.orders || 0;
        revenue = dayData.revenue || 0;
      }

      history.push({
        year,
        month,
        day: i,
        products,
        stores,
        orders,
        users,
        revenue
      });
    }

    return history;
  };

  async getUserMonthHistory(month: number, year: number, userId?:number): Promise<HistoryDataDto[]>{
    const result = this.userMonthHistoryRepo.createQueryBuilder("monthHistory")
      .select("monthHistory.day", "day")
      .addSelect("SUM(monthHistory.products)", "products")
      .addSelect("SUM(monthHistory.stores)", "stores")
      .addSelect("SUM(monthHistory.revenue)", "revenue")
      .where("monthHistory.month = :month", { month })
      .andWhere("monthHistory.year = :year", { year });

    if (userId) {
      result.andWhere("monthHistory.userId = :userId", { userId });
    }

    result.groupBy("monthHistory.day")
        .orderBy("day", "ASC");

    const aggregatedResult = await result.getRawMany();

    if (!aggregatedResult || aggregatedResult.length === 0) return [];

    const history: HistoryDataDto[] = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // Get days in month

    for (let i = 1; i <= daysInMonth; i++) {
      let products = 0;
      let stores = 0;
      let revenue = 0;

      const dayData = aggregatedResult.find((row: { day: number }) => row.day === i);
      if (dayData) {
        products = dayData.products || 0;
        stores = dayData.stores || 0;
        revenue = dayData.revenue || 0;
      }

      history.push({
        year,
        month,
        day: i,
        products,
        stores,
        revenue
      });
    }

    return history;
  };

  async getYearHistory (year: number): Promise<HistoryDataDto[]> {
    const result = this.yearHistoryRepo.createQueryBuilder("yearHistory")
      .select("yearHistory.month", "month")
      .addSelect("SUM(yearHistory.products)", "products")
      .addSelect("SUM(yearHistory.orders)", "orders")
      .addSelect("SUM(yearHistory.stores)", "stores")
      .addSelect("SUM(yearHistory.users)", "users")
      .addSelect("SUM(yearHistory.revenue)", "revenue")
      .where("yearHistory.year = :year", { year });


    result.groupBy("yearHistory.month")
      .orderBy("month", "ASC");

    const aggregatedResult = await result.getRawMany();    

    if (!aggregatedResult || aggregatedResult.length === 0) return [];

    const history: HistoryDataDto[] = [];

    for (let i = 0; i < 12; i++) {
      let products = 0;
      let orders = 0;
      let stores = 0;
      let users = 0;
      let revenue = 0;

      const month = aggregatedResult.find((row: { month: number }) => row.month === i);
      if (month) {
        stores = month.stores || 0;
        products = month.products || 0;
        orders = month.orders || 0;
        users = month.users || 0;
        revenue = month.revenue || 0;
      }

      history.push({
        year,
        month: i,
        products,
        orders,
        stores,
        users,
        revenue
      });
    }

    return history;
  };

  async getUserYearHistory (year: number, userId?:number): Promise<HistoryDataDto[]> {
    const result = this.userYearHistoryRepo.createQueryBuilder("yearHistory")
      .select("yearHistory.month", "month")
      .addSelect("SUM(yearHistory.products)", "products")
      .addSelect("SUM(yearHistory.stores)", "stores")
      .addSelect("SUM(yearHistory.revenue)", "revenue")
      .where("yearHistory.year = :year", { year });

    if (userId) {
      result.andWhere("yearHistory.userId = :userId", { userId });
    }

    result.groupBy("yearHistory.month")
      .orderBy("month", "ASC");

    const aggregatedResult = await result.getRawMany();

    if (!aggregatedResult || aggregatedResult.length === 0) return [];

    const history: HistoryDataDto[] = [];

    for (let i = 0; i < 12; i++) {
      let products = 0;
      let stores = 0;
      let revenue = 0;

      const month = aggregatedResult.find((row: { month: number }) => row.month === i);
      if (month) {
        products = month.products || 0;
        stores = month.stores || 0;
        revenue = month.revenue || 0;
      }

      history.push({
        year,
        month: i,
        products,
        stores,
        revenue
      });
    }

    return history;
  };
}
