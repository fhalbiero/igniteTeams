import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { useTheme } from 'styled-components/native';
import { AppRoutes } from "./app.routes";

export function Routes() {
    const { COLORS } = useTheme();
    
    return (
        <View style={{ flex: 1, backgroundColor: COLORS.GRAY_600 }}>
            <NavigationContainer>
                {/* If user is admin could implement and redirect to the <AdminRoutes /> for example */}
                <AppRoutes />
            </NavigationContainer>
        </View>
    );
}