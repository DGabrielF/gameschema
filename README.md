# POKÉCARD GAME

## Overview

### Introdução

Bem-vindo ao Pokémon Duel, um emocionante jogo online construído com Angular, CSS, PokeAPI e Firebase! Nossa missão é proporcionar uma experiência de duelos Pokémon única, combinando elementos estratégicos, colecionáveis e interação social.

### Público

Especialmente para os amantes de Pokémon. Qualquer idade e gênero.

### Gênero

Duelo de cartas, coleção de cartas.

### Número de Jogadores

Multiplayer, PVP, PVE.

### Plataformas

Web

### Identidade

Duelo de cartas de Pokémons

### Game Engine

HTML, CSS, JavaScript

### Estilo

2D

## 3 C's

### Câmera

- Câmera fixa
- 2D

### Personagem

- **Quem:** Um mestre Pokémon
- **Onde:** Sistema online de duelos e negociação de cartas
- **O que:** Comprar cartas, realizar missões e duelar 

### Controles
- Jogável apenas com o mouse
- Adicionar alguns atalhos

## Telas
### Mercado
- Menu lateral
  - Pacotes
  - Comprar
  - Vender
  - Trocar
- Tela principal
  - Quantidade de dinheiro
  - Buscador de ofertas
  - lista de ofertas
- Janela flutuante
  - Apresentar dados da transação
  - Botão de confirmar
  - Botão de cancelar

### Cartas
- Tela principal
  - Buscador de cartas
  - Cartas disponíveis
  - Menu de páginas
  - Cartas selecionadas

### Pokédex
- Tela principal
  - Buscador de cartas
  - Cartas disponíveis
  - Menu de páginas

### Buscar duelos
- Tela principal
  - Lista de inimigos nativos do sistema
  - Lista de outros jogadores
- Duelo
  - Cartas do adversário 
  - Área do duelo
    - sua carta
    - atributo escolhido
    - botão de ir
    - carta do adversário
  - Menu de atributos
    - altura
    - peso
    - vida
    - velocidade
    - ataque
    - defesa
  - Suas Cartas
  - Mensagem final

### Classificação
- Menu lateral
  - Duelo
  - Cartas
- Tela principal
  - Ordenador de lista
  - Posição do jogador
  - Lista de personagens


### Perfil
- Tela principal
  - Apelido
  - Imagem
  - Descrição
  - Aniversário
  - Gênero

### Conta
- Tela principal
  - Gerenciar senha
  - Gerenciar email
  - Desativar a conta

### Amigos
- Tela principal
  - Buscador de amigos
  - Lista de amigos
  - Solicitações recebidas
  - Solicitações enviadas
  - Lista de bloqueios

### Configurações
- Tela principal
  - Tamanho das cartas
  - Som
  - Volume

### Entrar
- Janela flutuante
  - Input email
  - Input senha
  - Botão de entrar
  - Botão de cadastrar
  - Botão pra entrar com Google

### Cadastrar
- Janela flutuante
  - Input apelido
  - Input email
  - Input senha
  - Input confirmar senha
  - Botão de cadastrar
  - Botão de entrar
  - Botão pra registrar com Google

### Sair
- Janela flutuante
  - Botão de confirmar
  - Botão de cancelar

## Serviços

### PokéAPI
Os dados utilizados para a construção do jogo, valores de atributos, tipos e imagens, foram obtidos da [PokéAPI](https://pokeapi.co/docs/v2#pokemon). Meus agradecimentos pelo trabalho maravilhoso de vocês.

- #### API
  - Pegar um pokémon por id ou nome
  - Pegar um série de pokemons usando um _offset_ e um _limit_
  - Tratar os dados obtidos para obter as informações necessárias

### Firebase
O sistema de autenticação de usuário, armazenamento de informações do jogo e de arquivos do jogador serão hospedados no [Firebase](https://firebase.google.com/). Melhor serviço que encontrei para desenvolver minhas aplicações.

- #### Authentication
  - Cadastrar usuário utilizando e-mail e senha
  - Cadastrar usuário utilizando conta google
  - Entrar utilizando e-mail e senha
  - Entrar utilizando conta google
  - Alteração de senha
  - Sair do jogo
- #### Firestore
  - Armazenar dados
  - Ler um dado
  - Ler todos os dados de uma coleção
  - Ler dados de uma coleção a partir de uma condição
  - Editar dados
  - Remover dados
- #### Firestorage
  - Guardar um arquivo no banco de dados
  - Ler um arquivo no banco de dados
  - Editar um arquivo no banco de dados
  - Remover um arquivo no banco de dados

# Agradecimentos

Meus agradecimentos a todos que testaram e ajudaram a melhorar a experiência desse jogo:
- Fayla Diamantino (Aspectos visuais, cores, combinações)
- Jonatas Cavalcante (Detecção de bugs, proposta de novas funcionalidade)
- Gustavo Mota (Organização do projeto, componentização e base de estudos)
- Lucas Araújo (Experiência do usuário, detecção de bugs)

Sem esquecer dos instrutores da [Digital Innovation One (DIO)](https://web.dio.me/) provedores de muito conhecimento técnico para esse desenvolvimento:
- [Elidiana](https://www.linkedin.com/in/elidianaandrade/)
- [Rafa](https://www.linkedin.com/in/rafaskoberg/)
- [Felipão](https://www.linkedin.com/in/felipeaguiar-exe/)
<!-- ✔️ -->