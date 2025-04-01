import { View, Text, StyleSheet } from "react-native"
import { Button } from "../components/Button"
import { useEffect, useState } from "react"
import * as WebBrowser from "expo-web-browser"
import { useOAuth } from "@clerk/clerk-expo"
import * as Linking from "expo-linking"

WebBrowser.maybeCompleteAuthSession()

export default function SignIn() {
    const [isLoadding, setIsLoading] = useState(false)
    const googleOauth = useOAuth({ strategy: "oauth_google" })

    async function onGoogleSignIn() {
        try {
            setIsLoading(true)

            const redirectUrl = Linking.createURL("/")
            const oAuthFlow = await googleOauth.startOAuthFlow({redirectUrl})

            if (oAuthFlow.authSessionResult?.type === "success") {
                if (oAuthFlow.setActive) {
                    await oAuthFlow.setActive({ session: oAuthFlow.createdSessionId })
                }
            } else {
                setIsLoading(false)
            }
        } catch (error) {
            console.log(error)
        }

    }


    useEffect(() => {
        WebBrowser.warmUpAsync()
        return () => {
            WebBrowser.coolDownAsync()
        }
    }, [])
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign In</Text>
            <Button
                icon="logo-google"
                title="Entrar com Google"
                onPress={() => { onGoogleSignIn() }}
                isLoading={isLoadding}
            />

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f0f0',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
})