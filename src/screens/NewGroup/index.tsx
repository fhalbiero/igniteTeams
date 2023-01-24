import { useNavigation } from "@react-navigation/native";

import { groupCreate } from "@storage/group/groupCreate";
import { Button } from "@components/Button";
import { Header } from "@components/header";
import { Highlight } from "@components/Highlight";
import { Input } from "@components/Input";
import { Container, Content, Icon } from "./styles";
import { useState } from "react";
import { AppError } from "@utils/AppError";
import { Alert } from "react-native";


export function NewGroup() {
    const navigation = useNavigation();

    const [group, setGroup] = useState('');

    async function handleNew() {
        try {
            if (group.trim().length === 0) {
                return Alert.alert("Novo Grupo", "Informe o nome da Turma");
            }

            await groupCreate(group.trim());
            navigation.navigate("players", { group })
        } catch (error) {
            if (error instanceof AppError) {
                Alert.alert('Novo Grupo', error.message);
            } else {
                Alert.alert('Novo Grupo', "Não foi possível criar um novo grupo");
                console.log(error);
            }
        }
    }

    return (
        <Container>
            <Header showBackButton />
            <Content>
                <Icon />
                <Highlight
                    title="Nova Turma"
                    subtitle="Crie a turma para adicionar pessoas"
                />
                <Input
                    placeholder="Nome da Turma"
                    onChangeText={setGroup}
                />
                <Button
                    title="Criar"
                    style={{ marginTop: 20 }}
                    onPress={handleNew}
                />
            </Content>
        </Container>
    )
}