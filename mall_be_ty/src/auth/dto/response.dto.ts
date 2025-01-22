import { ApiResponseProperty } from "@nestjs/swagger"
import { Exclude } from "class-transformer"

export class UserAuthReponse{
    @ApiResponseProperty({
        example: 1
    })
    id:number 

    @ApiResponseProperty({
        example: "John Doe"
    })
    public name:string

    @ApiResponseProperty({
        example: "test@example.com"
    })
    public email:string

    @ApiResponseProperty({
        example: "0200000000"
    })
    public phone:string

    @ApiResponseProperty({
        example: "1000000000000"
    })
    public createdAt:Date 

    @ApiResponseProperty({
        example: "0000000000000"
    })
    public updatedAt:Date 

    @ApiResponseProperty({
        example: "USER"
    })
    public role:string 

    @Exclude()
    password:string

    constructor(partial:Partial<UserAuthReponse>){
        Object.assign(this, partial)
    }
}

export class LoginReponse{
    @ApiResponseProperty({
        example: 1
    })
    id:number 

    @ApiResponseProperty({
        example: "John Doe"
    })
    public name:string

    @ApiResponseProperty({
        example: "test@example.com"
    })
    public email:string

    @ApiResponseProperty({
        example: "USER"
    })
    public role:string 

    backendTokens:BackendTokens

    @Exclude()
    phone:string

    @Exclude()
    createdAt:Date 

    @Exclude()
    updatedAt:Date 

    @Exclude()
    password:string

    constructor(partial:Partial<LoginReponse>){
        Object.assign(this, partial)
    }
}

class BackendTokens{
    @ApiResponseProperty({
        example: "wertyuioihgfdrtgui876543edfghuuytfcg-frtyuijbvcdertyuiokjhgfdfghjiuytfvbj-bvcdsertyuiokjnbcdfghjkjdfghb"
    })
    accessToken:string

    @ApiResponseProperty({
        example: "wertyuioihgfdrtgui876543edfghuuytfcg-frtyuijbvcdertyuiokjhgfdfghjiuytfvbj-bvcdsertyuiokjnbcdfghjkjdfghb"
    })
    refreshToken:string
}

export class RefreshTokenDto{
    @ApiResponseProperty({
        example: "wertyuioihgfdrtgui876543edfghuuytfcg-frtyuijbvcdertyuiokjhgfdfghjiuytfvbj-bvcdsertyuiokjnbcdfghjkjdfghb"
    })
    accessToken:string
}

export class ForgottenPasswordResponse{
    @ApiResponseProperty({
        example: "A reset link has been sent to your email."
    })
    message:string
}
