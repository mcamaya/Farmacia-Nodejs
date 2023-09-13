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