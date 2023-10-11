import { Product } from '../entities/product.entity';
import * as Nanoid from "nanoid";
import * as fs from "fs";
import * as path from "path";
import { UpdateProductDto } from '../dto/update-product.dto';

let store: { data: Product[] } = { data: [] };

// Write data for persistence
function syncToStorage() {
  fs.writeFileSync(path.join(__dirname, './mock.json'), JSON.stringify(store.data));
}

function addData(data: Product) {
  let uidLength = 8, collisionCounter = 0;
  let uid = Nanoid.nanoid(uidLength);
  
  //Mitigating Collisions of Product Id
  while(store.data.some(e=>e.productId === uid)) {
    // if collides more than 3 times, increase length upto a max of 21 
    if(collisionCounter==3) {
      uidLength = Math.min(uidLength + 1, 21);
      collisionCounter = 0;
    }

    uid = Nanoid.nanoid(uidLength);
    collisionCounter++;
  }

  data.productId = uid;
  store.data.push(data);
  
  syncToStorage();
  return data;
}

function deleteData(id: string) {
  store.data = store.data.filter(e=>e.productId!=id);

  syncToStorage();
}

function updateData(id: string, updateProductDto: UpdateProductDto) {
  const index = store.data.findIndex(e=>e.productId == id);
  
  if (updateProductDto.productName) {
    store.data[index].productName = updateProductDto.productName;
  }
  if (updateProductDto.productOwnerName) {
    store.data[index].productOwnerName = updateProductDto.productOwnerName;
  }
  if (updateProductDto.methodology) {
    store.data[index].methodology = updateProductDto.methodology;
  }
  if (updateProductDto.scrumMasterName) {
    store.data[index].scrumMasterName = updateProductDto.scrumMasterName;
  }
  if (updateProductDto.Developers) {
    store.data[index].Developers = updateProductDto.Developers;
  }
  if (updateProductDto.startDate) {
    store.data[index].startDate = updateProductDto.startDate;
  }
  if (updateProductDto.location) {
    store.data[index].location = updateProductDto.location;
  }

  syncToStorage();
  return store.data[index];
}

// Retrieve Data from mock.json and load it in memory(inside store.data)
async function bootUpStore() {
  await import("./mock.json").then(data=>{
    for(const product of data) {
      addData({ ...product });
    }
  })
}

export default store;

export { bootUpStore, addData, deleteData, updateData };
