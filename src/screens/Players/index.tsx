import { useState, useEffect, useRef } from "react"; 
import { Alert, FlatList, TextInput } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import { AppError } from "@utils/AppError";

import { ButtonIcon } from "@components/ButtonIcon";
import { Filter } from "@components/Filter";
import { Header } from "@components/header";
import { Highlight } from "@components/Highlight";
import { Input } from "@components/Input";
import { PlayerCard } from "@components/PlayerCard";
import { ListEmpty } from "@components/ListEmpty";
import { Button } from "@components/Button";
import { Loading } from '@components/Loading';

import { PlayerStorageDTO } from "@storage/player/PlayerStorageDTO";
import { playerAddByGroup } from "@storage/player/playerAddByGroup";
import { playersGetByGroupAndTeam } from "@storage/player/playerGetByGroupAndTeam";
import { playerRemoveByGroup } from "@storage/player/playerRemoveByGroup";
import { groupRemoveByName } from "@storage/group/groupRemoveByName";

import { Container, Form, HeaderList, NumberOfPlayers } from "./styles";

type RouteParams = {
    group: string;
}

export function Players() {
    const route = useRoute();
    const navigation = useNavigation();
    const { group } = route.params as RouteParams;

    const newPlayerNameInputRef = useRef<TextInput>(null);

    const [ newPlayerName, setNewPlayerName ] = useState('');
    const [ team, setTeam ] = useState("Time A");
    const [ players, setPlayers ] = useState<PlayerStorageDTO[]>([]);
    const [ isLoading, setIsLoading ] = useState(true);

    async function handleAddPlayer() {
        if (newPlayerName.trim().length === 0) {
            return Alert.alert('Novo Jogador', 'informe o nome do jogador para adicionar.');
        }

        const newPlayer: PlayerStorageDTO = {
            name: newPlayerName,
            team,
        }

        try {
            await playerAddByGroup(newPlayer, group);
            newPlayerNameInputRef.current?.blur();
            //close the keyboard, but I'm doing it by using blur
            //Keyboard.dismiss();
            setNewPlayerName('');
            fetchPlayersByTeam();           
        } catch (error) {
            if (error instanceof AppError) {
                Alert.alert('Novo Jogador', error.message);
            } else {
                Alert.alert('Novo Jogador', 'Não foi possivel adicionar o jogador');
                console.log(error);
            }
        }
    }

    async function handlePlayerRemove(playerName: string) {
        try {
            await playerRemoveByGroup(playerName, group);
            fetchPlayersByTeam();
        } catch (error) {
            console.log(error);
            Alert.alert('Remover Jogador', 'Não foi possivel remover o jogador selecionado')
        }
    }

    async function groupRemove() {
        try {
            await groupRemoveByName(group);
            navigation.navigate("groups");
        } catch (error) {
            console.log(error);
            Alert.alert('Remover Turma', 'Não foi possivel remover a Turma');
        }
    }

    async function handleGroupRemove() {
        Alert.alert(
            'Remover',
            'Deseja remover a Turma?',
            [
                { text: 'Não', style: 'cancel'},
                { text: 'Sim', onPress: () => groupRemove()}
            ]
        );
    }

    async function fetchPlayersByTeam() {
        try {
            setIsLoading(true);
            const playersByTeam = await playersGetByGroupAndTeam(group, team);
            setPlayers(playersByTeam);
        } catch (error) {
            console.log(error);
            Alert.alert('Jogadores', 'Não foi possivel carregar os jogadores do time selecionado');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchPlayersByTeam();
    }, [team]);

    return (
        <Container>
            <Header showBackButton />
            <Highlight
                title={group}
                subtitle="adicione a galera e separe os times"
            />
            <Form>
                <Input
                    inputRef={newPlayerNameInputRef}
                    placeholder="Nome da pessoa"
                    autoCorrect={false}
                    value={newPlayerName}
                    onChangeText={setNewPlayerName}
                    onSubmitEditing={handleAddPlayer}
                    returnKeyType="done"
                />
                <ButtonIcon 
                    icon="add" 
                    onPress={handleAddPlayer}
                />
            </Form>

            <HeaderList>
                <FlatList
                    data={['Time A', 'Time B']}
                    keyExtractor={ item => item }
                    renderItem={ ({ item }) => (
                        <Filter
                            title={item}
                            isActive={item === team}
                            onPress={() => setTeam(item)}
                        />
                    )}
                    horizontal
                />
                <NumberOfPlayers>
                    {players.length}
                </NumberOfPlayers>
            </HeaderList>

            {isLoading ? <Loading /> : (
                <FlatList
                    data={players}
                    keyExtractor={item => item.name}
                    renderItem={({ item }) => (
                        <PlayerCard
                            name={item.name}
                            onRemove={() => handlePlayerRemove(item.name)}
                        />
                    )}
                    ListEmptyComponent={() => (
                        <ListEmpty
                            message="Não há pessoas nesse time"
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[
                        { paddingBottom: 100 },
                        players.length === 0 && { flex: 1 }
                    ]}
                />
            )}
            
            <Button
                title="Remover turma"
                type="SECUNDARY"
                onPress={handleGroupRemove}
            />
        </Container>
    )
}