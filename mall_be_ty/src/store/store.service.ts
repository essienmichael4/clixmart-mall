import { Injectable } from '@nestjs/common';
import { CreateStoreDto, NextOfKinDto, StoreAddressDto, StoreDetailsDto, StorePaymentDetailsDto } from './dto/create-store.dto';
import { UpdateStoreDto, UpdateStoreReviewDto } from './dto/update-store.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { StoreDetail } from './entities/storeDetails.entity';
import { StoreAddress } from './entities/storeAddress.entity';
import { PaymentDetail } from './entities/paymentDetails.entity';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { NextOfKin } from './entities/nextOfKin.entity';
import { Status, StoreReview } from './entities/storeReview.entity';
import { MonthHistory } from 'src/product/entities/MonthHistory.entity';
import { YearHistory } from 'src/product/entities/YearHistory.entity';
import { v4 } from 'uuid';
import { GetDay, GetMonth, GetYear } from 'src/helpers/common';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store) private readonly storeRepo:Repository<Store>,
    @InjectRepository(StoreDetail) private readonly storeDetailRepo:Repository<StoreDetail>,
    @InjectRepository(StoreReview) private readonly storeReviewRepo:Repository<StoreReview>,
    @InjectRepository(StoreAddress) private readonly storeAddressRepo:Repository<StoreAddress>,
    @InjectRepository(PaymentDetail) private readonly paymentDetailRepo:Repository<PaymentDetail>,
    @InjectRepository(NextOfKin) private readonly nextOfKinRepo:Repository<NextOfKin>,
    @InjectRepository(MonthHistory) private readonly monthHistoryRepo:Repository<MonthHistory>,
    @InjectRepository(YearHistory) private readonly yearHistoryRepo:Repository<YearHistory>,
    @InjectRepository(User) private readonly userRepo:Repository<User>,
    private userService: UserService,
    private readonly dataSource:DataSource
  ){}

  async create(createStoreDto: CreateStoreDto, userId:number) {
    const queryRunner = this.dataSource.createQueryRunner()
    const user = await this.userRepo.findOne({where: {
        id:userId
      }, relations: ["stores"]
    })
    
    const unspaced = this.generateUspacedName(createStoreDto.name.toLowerCase())
    
    try{
      await queryRunner.connect()
      await queryRunner.startTransaction()

      const storeReviewEntity = await this.storeReviewRepo.create({
        status: Status.PENDING,
        storeReviewId: v4()
      })

      const storeReview = await this.createStoreReview(storeReviewEntity, queryRunner)

      const storeEntity =  this.storeRepo.create()
      const saveEntity = {
        ...storeEntity,
        name: createStoreDto.name,
        searchName: createStoreDto.name.toLowerCase(),
        storeId: v4(),
        url: this.generateStoreUrl(unspaced),
        slug: unspaced,
        storeReview: storeReview,
        user
      }
    
      const store = await this.createStore(saveEntity, queryRunner)
      await this.upsertMonthHistoryStores(queryRunner)
      await this.upsertYearHistoryStores(queryRunner)

      await queryRunner.commitTransaction()
      return store
    }catch(err){
      await queryRunner.rollbackTransaction()
      throw err
    }finally{
      await queryRunner.release()
    }
  }

  async addStoreDetails(id:number,storeDetailsDto:StoreDetailsDto){
    try{
      const store = await this.storeRepo.findOneBy({id})
      const storeDetailEntity = this.storeDetailRepo.create()
      const saveEntity = {
        ...storeDetailEntity,
        storeDetailId: v4(),
        isRegistered: storeDetailsDto.isRegistered,
        nationalId: storeDetailsDto.nationalId
      }

      const storeDetail = await this.storeDetailRepo.save(saveEntity) 
      store.storeDetail = storeDetail
      return this.storeRepo.save(store)
    }catch(err){
      throw err
    }
  }

  async addNextOfKin(id:number, nextOfKinDto:NextOfKinDto){
    try{
      const store = await this.storeRepo.findOneBy({id})
      const nextOfKinEntity = this.nextOfKinRepo.create()
      const saveEntity = {
        ...nextOfKinEntity,
        nextOfKinId: v4(),
        name: nextOfKinDto.name,
        phone: nextOfKinDto.phone
      }

      const nextOfKin = await this.nextOfKinRepo.save(saveEntity) 
      store.nextOfKin = nextOfKin
      return await this.storeRepo.save(store)
    }catch(err){
      throw err
    }
  }

  async addStoreAddress(id:number, storeAddressDto:StoreAddressDto){
    try{
      const store = await this.storeRepo.findOneBy({id})
      const storeAddressEntity = this.storeAddressRepo.create()

      const saveEntity = {
        ...storeAddressEntity,
        storeAddressId: v4(),
        country: storeAddressDto.country,
        state: storeAddressDto.state,
        city: storeAddressDto.city,
        zip: storeAddressDto.zip,
        addressLine: storeAddressDto.addressLine,
        fullname: storeAddressDto.fullname,
        phone: storeAddressDto.phone,
        landmark: storeAddressDto.landmark
      }
      console.log(saveEntity)

      const storeAdress = await this.storeAddressRepo.save(saveEntity) 
      store.storeAddress = storeAdress
      return await this.storeRepo.save(store)
    }catch(err){
      throw err
    }
  }

  async addStorePaymentDetails(id:number, storePaymentDetailsDto:StorePaymentDetailsDto){
    try{
      const store = await this.storeRepo.findOneBy({id})
      const paymentDetailEntity = this.paymentDetailRepo.create()

      const saveEntity = {
        ...paymentDetailEntity,
        paymentDetailId: v4(),
        paymentMode: storePaymentDetailsDto.paymentMode,
        accountName: storePaymentDetailsDto.accountName,
        accountNumber: storePaymentDetailsDto.accountNumber,
        provider: storePaymentDetailsDto.provider
      }

      const paymentDetail = await this.paymentDetailRepo.save(saveEntity) 
      store.paymentDetail = paymentDetail
      return await this.storeRepo.save(store)
    }catch(err){
      throw err
    }
  }
  
  addImage() {
    return `This action returns all store`;
  }

  
    async createStore(payload:Store, queryRunner: QueryRunner){
      return await queryRunner.manager.save(Store, {
        ...payload
      })
    }
  
    async createStoreReview(payload:StoreReview, queryRunner: QueryRunner){
      return await queryRunner.manager.save(StoreReview, {
        ...payload
      })
    }

  findAll() {
    return this.storeRepo.find({
      relations: {
        user: true,
        storeDetail: true,
        storeReview: true
      }
    })
  }

  async findAllUserStores(userId:number){
    const user = await this.userService.findUserById(userId)
    return await this.storeRepo.find({
      relations: {
        user: true,
        storeReview: true
      },
      where:{
        user: {
          id: userId
        }
      }
    })
  }

  findOne(id: number) {
    try{
      return this.storeRepo.findOne({
        where: {id},
        relations: {
          storeReview: {
            user: true
          },
          user: true,
          storeDetail: true,
          storeAddress: true,
          paymentDetail: true
        }
      })
    }catch(err){
      throw err
    }
  }

  update(id: number, updateStoreDto: UpdateStoreDto) {
    return `This action updates a #${id} store`;
  }

  async updateStoreName(id:number, createStoreDto: CreateStoreDto, userId:number) {
    // const user = await this.userService.findUserById(userId)
    try{
      const store = await this.storeRepo.update(id,{
        name: createStoreDto.name,
        searchName: createStoreDto.name.toLowerCase()
      })

      return store
    }catch(err){
      throw err
    };
  }

  async updateStoreReview(id:number, updateStoreReviewDto: UpdateStoreReviewDto, userId:number) {
    const user = await this.userRepo.findOne({
      where: {id:userId},
      relations: {
        storeReviews: true
      }
    })
    try{
      const store = await this.storeRepo.findOne({
        where: {id},
        relations: {storeReview:true}
      })

      await this.storeReviewRepo.update(store.storeReview.id, {
        ...(updateStoreReviewDto.status && { status:updateStoreReviewDto.status }),
        ...(updateStoreReviewDto.description && { description:updateStoreReviewDto.description }),
      })

      const storeReview = await this.storeReviewRepo.findOneBy({id:store.storeReview.id})

      const reviews = user.storeReviews.filter(review => review.id !== store.storeReview.id)
      user.storeReviews = [ ...reviews, storeReview ]
      await this.userRepo.save(user)
      
      return storeReview
    }catch(err){
      throw err
    };
  }

  async upsertMonthHistoryStores(queryRunner: QueryRunner){
    const day = GetDay()
    const month = GetMonth()
    const year = GetYear()
    
    const monthHistory = await this.monthHistoryRepo.findOne({
      where: { day, month, year }
    })

    if(monthHistory){
      monthHistory.stores += 1
      return await queryRunner.manager.save(MonthHistory, {...monthHistory})
    }else{
      const newMonthHistory = this.monthHistoryRepo.create({
        day, month, year, stores: 1
    })
      return await queryRunner.manager.save(MonthHistory, {...newMonthHistory})
    }

  }
  
  async upsertYearHistoryStores(queryRunner: QueryRunner){
    const month = GetMonth()
    const year = GetYear()
    
    const yearHistory = await this.yearHistoryRepo.findOne({
      where: { month, year }
    })

    if(yearHistory){
      yearHistory.stores += 1
      return await queryRunner.manager.save(YearHistory, {...yearHistory})
    }else{
      const newYearHistory = this.yearHistoryRepo.create({
        month, year, stores: 1
    })
      return await queryRunner.manager.save(YearHistory, {...newYearHistory})
    }

  }

  remove(id: number) {
    return `This action removes a #${id} store`;
  }

  generateUspacedName(name:string): string {
    const spilt = name.split(" ").join("-") 
    const removeOpenParenthesis = spilt.replaceAll("(", "")
    const removecloseParenthesis = removeOpenParenthesis.replaceAll(")", "")
    const removeOpenBrackets = removecloseParenthesis.replaceAll("[", "")
    const removecloseBrackets = removeOpenBrackets.replaceAll("]", "")

    return removecloseBrackets
  }

  generateStoreUrl(name:string): string{
    const url = `https://clixmartonline.com/store/${name}`

    return url
  }
}
