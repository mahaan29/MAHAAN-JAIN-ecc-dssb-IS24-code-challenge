import { ApiProperty } from "@nestjs/swagger";
import { ArrayMaxSize, ArrayNotEmpty,  IsArray, IsIn, IsNotEmpty, Matches } from "class-validator";

// Define Network DTO for Product creation
export class CreateProductDto {
    @IsNotEmpty()
    @ApiProperty({ example: 'ProductName', type: 'string', required: true })
    productName: string;

    @Matches(/^[a-z0-9 ]+$/i)
    @IsNotEmpty()
    @ApiProperty({ example: 'ProductOwnerName', type: 'string', required: true })
    productOwnerName: string;

    @ArrayMaxSize(5)
    @ArrayNotEmpty()
    @IsArray()
    @ApiProperty({ example: ['Dev1', 'Dev2', 'Dev3'], type: 'string', isArray: true, required: true })
    Developers: string[];

    @Matches(/^[a-z0-9 ]+$/i)
    @IsNotEmpty()
    @ApiProperty({ example: 'ScrumMasterName', required: true })
    scrumMasterName: string;

    @Matches(/^\d{4}\/\d{2}\/\d{2}$/, { message: "startDate must be of the format YYYY/MM/DD" })
    @IsNotEmpty()
    @ApiProperty({ example: '2023/03/31', required: true })
    startDate: string;

    @IsIn(['Agile', 'Waterfall'])
    @IsNotEmpty()
    @ApiProperty({ example: 'Waterfall', required: true })
    methodology: string;

    // @Matches(/^[a-z0-9 ]+$/i)
    @IsNotEmpty()
    @ApiProperty({ example: 'www.github.com/bcgov', required: true })
    location: string;

}