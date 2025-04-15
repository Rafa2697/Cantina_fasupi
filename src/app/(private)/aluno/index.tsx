import { View, Text, StyleSheet, Image } from 'react-native'
import Button from '../../../components/Button/index'
import { useAuth, useUser } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'

export default function Home() {
    const { user } = useUser()
    const { signOut } = useAuth()
    const router = useRouter()

    const handleSignOut = async () => {
        await signOut()
        router.replace('/(public)')
    }

    return (
        
            <View style={styles.container}>
                <Image source={{ uri: user?.imageUrl }} style={styles.image} />
                <Text style={styles.text}>Olá, {user?.fullName}</Text>
                <Button icon='exit' title='Sair' onPress={handleSignOut} />
            </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32,
        justifyContent: "center",
        alignItems: "center",
        gap: 12
    },
    text: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#000"
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 12
    }
})