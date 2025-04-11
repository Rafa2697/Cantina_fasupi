import { TouchableOpacity, TouchableOpacityProps, Text, ActivityIndicator, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons"

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    isLoading?: boolean;
    icon: keyof typeof Ionicons.glyphMap;
}

export default function Button({ title, isLoading = false, icon, ...rest }: ButtonProps) {
    return (
        <TouchableOpacity style={styles.constainer} disabled={isLoading} activeOpacity={0.8} {...rest}>
            {isLoading ? (
                <ActivityIndicator color={"white"} />
            ) : (
                <>
                    <Ionicons style={styles.icon} name={icon} />
                    <Text style={styles.title}>{title}</Text>
                </>
            )}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    constainer: {
        width:"90%",
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"center",
        gap:7,
        backgroundColor: "#000",
        padding: 22,
        borderRadius: 22,
        marginTop: 20,
        
    },
    icon:{
        color:"#fff",
        fontSize: 20,
    },
    title:{
        color:"#fff",
        fontSize: 16,
    }
})