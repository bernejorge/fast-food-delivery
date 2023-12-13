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
         console.error('Error al realizar la solicitud:', error);
       }
   },
   add_order_lines: async (args) =>{
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
        console.error('Error al agregar líneas de orden:', error.response ? error.response.data : error.message);
      }
   },
   remove_order_lines: async (args) =>{

   },

   cancel_order: async (args) =>{

   },

   confirm_order: async (args) =>{
      return "Su orden ha sido confirmada. Estara lista en aproximadamente 33 minutos."
   }
}
export default functions_to_call;