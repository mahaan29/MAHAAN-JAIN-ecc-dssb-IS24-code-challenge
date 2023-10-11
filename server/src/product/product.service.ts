import { BadRequestException, NotFoundException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import store, { addData, updateData, deleteData } from './data/store';

// Product Service - contains functionality used by controller
@Injectable()
export class ProductService {
  //Create New Product Endpoint
  create(createProductDto: CreateProductDto) {
    return addData(createProductDto);
  }

  // Returns list of all Products
  findAll() {
    return store.data;
  }

  // Find a product based on Product ID
  findOne(id: string) {
    const product = store.data.find((e) => e.productId === id);

    if(product) {
      return product;
    } else {
      throw new NotFoundException(`Product ID specified does not exist.`);
    }
  }

  //Update a given Product Entry (Uses findOne nested within)
  update(id: string, updateProductDto: UpdateProductDto) {
    this.findOne(id); // Using as check for product with id to exist, will throw err if not found

    return updateData(id, updateProductDto);
  }

  //Delete a product entry Endpoint
  remove(id: string) {
    this.findOne(id); // Using as check for product with id to exist, will throw err if not found
    
    deleteData(id);
    
    return null;
  }
}
