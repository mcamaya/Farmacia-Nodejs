# Sistema Gestión Farmacia


## API Reference

#### Obtener todos los medicamentos

```bash
  GET /api/v1/medicamentos
```
#### 1. Obtener todos los medicamentos con menos de 50 unidades en stock

```bash
  GET /api/v1/medicamentos/stock_-50
```
#### 3. Medicamentos comprados al proveedor ingresado

```bash
  GET /api/v1/medicamentos/provided_by?provider=${nombre_proveedor}
```

| Parameter           | Type     | Description                       |
| :--------           | :------- | :-------------------------------- |
| `nombre_proveedor`  | `string` | **Requerido**. Nombre a buscar |


#### 4. Obtener recetas médicas emitidas después del 1 de enero de 2023

```bash
  GET /api/v1/ventas/prescription_2023
```

#### 5. Total de ventas del medicamento ingresado
```bash
  GET /api/v1/ventas/medicines_in_sales/${medicine}
```

| Parameter   | Type     | Description                       |
| :--------   | :------- | :-------------------------------- |
| `medicine`  | `string` | **Requerido**. Medicamento a buscar |


#### 6. Medicamentos que caducan antes del 1 de enero de 2025

```bash
  GET /api/v1/medicamentos/expires_2024
```

#### 7. Total de medicamentos vendidos por cada proveedor

```bash
  GET /api/v1/medicamentos/all_providers
```

#### 8. Cantidad total de dinero recaudado por las ventas de medicamentos
```bash
  GET /api/v1/ventas/total_sales
```

#### 9. Medicamentos que no han sido vendidos.
```bash
  GET /api/v1/medicamentos/not_sold
```

#### 10. Obtener el medicamento más caro.
```bash
  GET /api/v1/medicamentos/most_expensive
```

#### 11. Número de medicamentos por proveedor.
```bash
  GET /api/v1/medicamentos/all_providers
```

#### 12. Pacientes que han comprado Paracetamol.
```bash
  GET /api/v1/ventas/bought_paracetamol
```

#### 14. Obtener el total de medicamentos vendidos en marzo de 2023
```bash
  GET /api/v1/ventas/sales_2023
```

#### 15. Obtener el medicamento menos vendido en 2023
```bash
  GET /api/v1/ventas/less_sold_2023
```

#### 16. Ganancia total por proveedor en 2023 (asumiendo un campo precioCompra en Compras).
```bash
  GET /api/v1/ventas/less_sold_2023
```