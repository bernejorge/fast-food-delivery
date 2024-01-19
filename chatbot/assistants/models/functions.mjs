import axios from 'axios';

const url = 'http://localhost:3000/api/';

const functions_to_call = {
   create_order: async (args) =>{
      const endpoint = url + 'ordenes/'
      try {
         const data = {
            "orden": {
              "telefono": args.telefono,
              "estado": "Pendiente"
            },
            "lineasOrden": args.order_lines
          };
         const response = await axios.post(endpoint, data);
         console.log(response.data);
         return response.data;
       } catch (error) {
         const errorMessage = error.response ? error.response.data : error.message;
         console.error('Error al realizar la solicitud:', errorMessage);
         return errorMessage;
       }
   },
   add_products: async (args) =>{
      const endpoint = url + 'ordenes/agregar-lineas/'
      const { order_lines, order_id } = args;

      try {
        // Suponiendo que la API espera que el ID de la orden vaya como parte de la URL
        const response = await axios.post(endpoint, {
          id: order_id,
          lineas: order_lines // Aquí se envían las líneas del pedido en el cuerpo de la solicitud
        });
    
        console.log('Líneas de orden agregadas:', response.data);
        return response.data;
      } catch (error) {
         const errorMessage = error.response ? error.response.data : error.message; 
        console.error('Error al agregar líneas de orden:', errorMessage);
        return errorMessage;
      }
   },
   
   remove_order_lines: async (args) =>{
      const endpoint = url + 'ordenes/quitarProductosOrdenados/'
      const { order_lines, order_id } = args;

      try {
        
         const response = await axios.post(endpoint, {
           id: order_id,
           lineas: order_lines // Aquí se envían las líneas del pedido en el cuerpo de la solicitud
         });
     
         console.log('Líneas de orden agregadas:', response.data);
         return response.data;
       } catch (error) {
         const errorMessage = error.response ? error.response.data : error.message;
         console.error('Error al agregar líneas de orden:', errorMessage);
         return errorMessage;
       }
   },

   cancel_order: async (args) =>{
    
      const { order_id } = args;
      const endpoint = url + `ordenes/${order_id}/`;
      try {
         const response = await axios.delete(endpoint, {
            id: order_id,
         });
         console.log('orden cancelada: ', response.data);
         return response.data;
      } catch (error) {
         const errorMessage = error.response ? error.response.data : error.message;
         console.error('Error al agregar líneas de orden:',errorMessage);
         return errorMessage; 
      }

   },

   confirm_order: async (args) =>{

      const { order_id } = args;
      const endpoint = url + `ordenes/confirmar/`;
      try {
         const response = await axios.post(endpoint, {
            ordenId: order_id,
         });
         console.log('orden cancelada: ', response.data);
         return response.data;
      } catch (error) {
         const errorMessage = error.response ? error.response.data : error.message;
         console.error('Error al agregar líneas de orden:',errorMessage);
         return errorMessage; 
      }
   },
   retrive_orders_non_finished : async (args) =>{
      const { telefono } = args;
      const endpoint = url + `ordenes/buscarOrdenesPorTelefonoNoFinalizadas/${telefono}/`;
      try {
         const response = await axios.get(endpoint);
         console.log('ordene recuperadas: ', response.data);
         return response.data;
      } catch (error) {
         const errorMessage = error.response ? error.response.data : error.message;
         console.error('Error al agregar líneas de orden:',errorMessage);
         return errorMessage; 
      }
   }
}
export default functions_to_call;