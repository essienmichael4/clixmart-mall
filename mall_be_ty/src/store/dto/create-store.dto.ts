import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import { Registered } from "../entities/storeDetails.entity";
import { Mode } from "../entities/paymentDetails.entity";

export class CreateStoreDto {
    @ApiProperty({
        description: "Category name",
        example: "Electronics",
        required: true
    })
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    name:string 
}

export class StoreDetailsDto {
    @ApiProperty({
        description: "National ID Card",
        example: "GHA-XXXXXXXXXX-XXX",
        required: true
    })
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    nationalId:string 

    @ApiProperty({
        description: "Is store registered",
        example: "FALSE",
        required: true
    })
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    isRegistered:Registered 
}

export class StoreAddressDto {
    @ApiProperty({
        description: "Country name",
        example: "Ghana",
        required: true
    })
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    country:string 

    @ApiProperty({
        description: "State or region name",
        example: "Greater Accra",
        required: false
    })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    state:string 

    @ApiProperty({
        description: "City name",
        example: "Greater Accra",
        required: false
    })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    city:string 

    @ApiProperty({
        description: "Street Address",
        example: "12 Oakland Street",
        required: true
    })
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    addressLine:string 

    @ApiProperty({
        description: "Zip code",
        example: '0000',
        required: true
    })
    @IsString()
    zip:string

    
    @ApiProperty({
        description: "Street Address",
        example: "12 Oakland Street",
        required: true
    })
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    fullname:string 

    
    @ApiProperty({
        description: "Street Address",
        example: "0200000000",
        required: true
    })
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    phone:string 

    @ApiProperty({
        description: "Nearest Landmark",
        example: "TDC Towers",
        required: false
    })
    @IsOptional()
    @IsString()
    landmark:string 
}

export class StorePaymentDetailsDto {
    @ApiProperty({
        description: "Mode of payment",
        example: "BANK",
        required: true
    })
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    paymentMode:Mode 

    @ApiProperty({
        description: "Name on account",
        example: "John Doe",
        required: true
    })
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    accountName:string 

    @ApiProperty({
        description: "Number of account",
        example: "1000000000000",
        required: true
    })
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    accountNumber:string 

    @ApiProperty({
        description: "Account's institution",
        example: "GCB LTD PLC",
        required: true
    })
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    provider:string 
}

export class NextOfKinDto {
    @ApiProperty({
        description: "Name of next of kin",
        example: "John Doe",
        required: true
    })
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    name:string 

    @ApiProperty({
        description: "Phone number of next of kin",
        example: "John Doe",
        required: true
    })
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    phone:string 
}

export class PaymentDto {
    @ApiProperty({
        description: "Amount paid to vendor",
        example: 2000,
        required: true
    })
    @IsDefined()
    @IsNumber()
    @IsPositive()
    amount:number 
}
