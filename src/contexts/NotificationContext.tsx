// Importações necessárias do React e bibliotecas de notificação
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useRef,
    ReactNode,
} from "react";
import * as Notifications from "expo-notifications";
import { Subscription } from "expo-notifications";
import { registerForPushNotificationsAsync } from "@/utils/registerForPushNotificationsAsync";

// Interface que define a estrutura dos dados do contexto
interface NotificationContextType {
    expoPushToken: string | null;
    notification: Notifications.Notification | null;
    error: Error | null;
}

// Criação do contexto com valor inicial undefined
const NotificationContext = createContext<NotificationContextType | undefined>(
    undefined
);

// Hook personalizado para acessar o contexto de notificação
export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error(
            "useNotification must be used within a NotificationProvider"
        );
    }
    return context;
};

// Interface para as props do Provider
interface NotificationProviderProps {
    children: ReactNode;
}

// Componente Provider que gerencia o estado das notificações
export const NotificationProvider: React.FC<NotificationProviderProps> = ({
    children,
}) => {
    // Estados para gerenciar token, notificação e erros
    const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
    const [notification, setNotification] = useState<Notifications.Notification | null>(null);
    const [error, setError] = useState<Error | null>(null);

    // Refs para armazenar as inscrições dos listeners
    const notificationListener = useRef<Subscription>();
    const responseListener = useRef<Subscription>();

    useEffect(() => {
        // Registra o dispositivo para notificações push
        registerForPushNotificationsAsync().then(
            (token) => setExpoPushToken(token),
            (error) => setError(error)
        );

        // Listener para quando uma notificação é recebida
        notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
            console.log("🔔 Notification Received: ", notification);
            setNotification(notification);
        });

        // Listener para quando o usuário interage com uma notificação
        responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
            console.log(
                "🔔 Notification Response: ",
                JSON.stringify(response, null, 2),
                JSON.stringify(response.notification.request.content.data, null, 2)
            );
            // Aqui você pode adicionar lógica para lidar com a resposta da notificação
        });

        // Cleanup: remove os listeners quando o componente é desmontado
        return () => {
            if (notificationListener.current) {
                Notifications.removeNotificationSubscription(
                    notificationListener.current
                );
            }
            if (responseListener.current) {
                Notifications.removeNotificationSubscription(responseListener.current);
            }
        };
    }, []);

    // Fornece o contexto para os componentes filhos
    return (
        <NotificationContext.Provider
            value={{ expoPushToken, notification, error }}
        >
            {children}
        </NotificationContext.Provider>
    );
};