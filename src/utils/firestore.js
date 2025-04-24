import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/config.js";


const enviarPedido = async (pedido) => {
  await addDoc(collection(db, 'pedidos'), {
    
  })
}