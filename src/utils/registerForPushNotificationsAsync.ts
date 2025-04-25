// Importações necessárias para notificações push
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";

/**
 * Função responsável por registrar o dispositivo para receber notificações push
 * returns Promise<string> Token único do dispositivo para notificações push
 * throws Error se as permissões não forem concedidas ou se não for um dispositivo físico
 */
export async function registerForPushNotificationsAsync() {
    // Configuração específica para dispositivos Android
    // Cria um canal de notificação com configurações personalizadas
    if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX, // Prioridade máxima para notificações
            vibrationPattern: [0, 250, 250, 250], // Padrão de vibração personalizado
            lightColor: "#FF231F7C", // Cor do LED de notificação
        });
    }

    // Verifica se é um dispositivo físico (não é um emulador)
    if (Device.isDevice) {
        // Verifica se já temos permissão para enviar notificações
        const { status: existingStatus } =
            await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        // Se não tivermos permissão, solicita ao usuário
        if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        // Se mesmo após solicitar, a permissão não for concedida, lança um erro
        if (finalStatus !== "granted") {
            throw new Error(
                "Permission not granted to get push token for push notification!"
            );
        }

        // Obtém o ID do projeto Expo necessário para gerar o token
        const projectId =
            Constants?.expoConfig?.extra?.eas?.projectId ??
            Constants?.easConfig?.projectId;
            
        // Verifica se o ID do projeto foi encontrado
        if (!projectId) {
            throw new Error("Project ID not found");
        }

        try {
            // Gera o token único para o dispositivo
            const pushTokenString = (
                await Notifications.getExpoPushTokenAsync({
                    projectId,
                })
            ).data;
            console.log(pushTokenString); // Log do token para debug
            return pushTokenString;
        } catch (e: unknown) {
            // Captura e relança qualquer erro que ocorra durante a geração do token
            throw new Error(`${e}`);
        }
    } else {
        // Erro caso tente usar em um emulador
        throw new Error("Must use physical device for push notifications");
    }
}