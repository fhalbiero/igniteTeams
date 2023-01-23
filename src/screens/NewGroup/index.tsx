import { Button } from "@components/Button";
import { Header } from "@components/header";
import { useNavigation } from "@react-navigation/native";
import { Highlight } from "@components/Highlight";
import { Input } from "@components/Input";
import { Container, Content, Icon } from "./styles";


export function NewGroup() {
    const navigation = useNavigation();

    function handleNew() {
        navigation.navigate("players", { group: "X" })
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