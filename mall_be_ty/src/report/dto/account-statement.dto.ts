import { ApiResponseProperty } from "@nestjs/swagger"

export class AccountStatementLine {
    @ApiResponseProperty({
        example: "1000000000000"
    })
    public date:string 

    @ApiResponseProperty({
        example: "0000000000000"
    })
    public description:string 

    @ApiResponseProperty({
        example: 300
    })
    public debit:number 

    @ApiResponseProperty({
        example: 300
    })
    public credit:number 

    @ApiResponseProperty({
        example: 300
    })
    public balance:number 
}
