import * as Notifications from 'expo-notifications';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';

export class OrderNotificationService {
  private unsubscribe: () => void | undefined;

  // Inicia o monitoramento de novos pedidos
  public startListening() {
    const pedidosRef = collection(db, 'pedidos');
    // Monitora apenas pedidos pendentes
    const pedidosQuery = query(
      pedidosRef,
      where('status', '==', 'pendente')
    );

    this.unsubscribe = onSnapshot(pedidosQuery, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          this.notifyNewOrder(change.doc.data());
        }
      });
    });
  }

  // Para o monitoramento
  public stopListening() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  // Envia a notificação local
  private async notifyNewOrder(pedido: any) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Novo Pedido! 🔔',
        body: `Pedido de ${pedido.userName}`,
        data: { pedidoId: pedido.id },
      },
      trigger: null // null significa envio imediato
    });
  }
}