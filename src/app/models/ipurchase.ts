import { IClient } from './iclient';
import { IProduct } from './iproduct';

export interface IPurchase {
  id_venta?: number,
  cantidad: number,
  valor_total: any,
  id_producto: number,
  id_cliente: number,
  producto?: IProduct,
  cliente?: IClient
}
