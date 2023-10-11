import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from "./entities/product.entity";

// Controller for /api/product
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // Add New Product
  @ApiCreatedResponse({ type: Product, status: HttpStatus.CREATED })
  @ApiBadRequestResponse({ status: HttpStatus.BAD_REQUEST })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  // Find all Products
  @ApiOkResponse({ type: Product, isArray: true, status: HttpStatus.OK, description: "Returns array of all products" })
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.productService.findAll();
  }

  // Find a Given Product by id
  @ApiOkResponse({ type: Product, status: HttpStatus.OK , description: "Product with id is found, returns product"})
  @ApiNotFoundResponse({ status: HttpStatus.NOT_FOUND, description: "No product with id is found"})
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  // Update a given product entry
  @ApiOkResponse({ type: Product, status: HttpStatus.OK, description: "Product is updated succesfully, returns updated product" })
  @ApiBadRequestResponse({status: HttpStatus.BAD_REQUEST, description: "Update payload is malformed"})
  @ApiNotFoundResponse({ status: HttpStatus.NOT_FOUND, description: "No product with id is found"})
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  // Delete a given Product Entry
  @ApiOkResponse({status: HttpStatus.NO_CONTENT, description: "Product is deleted succesfully"})
  @ApiNotFoundResponse({ status: HttpStatus.NOT_FOUND, description: "No product with id is found" })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
